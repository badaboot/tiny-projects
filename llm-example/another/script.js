import * as webllm from "https://esm.run/@mlc-ai/web-llm";

const messages = [
    {
        content: "You are a helpful AI agent helping users.",
        role: "system",
    },
];

const availableModels = webllm.prebuiltAppConfig.model_list.map(
    (m) => m.model_id
);
let selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC-1k";

// Callback function for initializing progress
function updateEngineInitProgressCallback(report) {
    console.log("initialize", report.progress);
    document.getElementById("download-status").textContent = report.text;
}

// Create engine instance
const engine = new webllm.MLCEngine();
engine.setInitProgressCallback(updateEngineInitProgressCallback);

async function initializeWebLLMEngine() {
    document.getElementById("download-status").classList.remove("hidden");
    selectedModel = document.getElementById("model-selection").value;
    const config = {
        temperature: 1.0,
        top_p: 1,
    };
    await engine.reload(selectedModel, config);
}

async function streamingGenerating(
    messages,
    onUpdate,
    onFinish,
    onError
) {
    try {
        let curMessage = "";
        const completion = await engine.chat.completions.create({
            stream: true,
            messages,
        });
        for await (const chunk of completion) {
            if (isStopTalk) break
            const curDelta = chunk.choices[0].delta.content;
            if (curDelta) {
                curMessage += curDelta;
            }
            onUpdate(curMessage);
        }
        console.log('is stop talking', isStopTalk)
        const finalMessage = await engine.getMessage();
        onFinish(finalMessage);
    } catch (err) {
        onError(err);
    }
}

/*************** UI logic ***************/
const inputElem = document.getElementById("user-input")
inputElem.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        onMessageSend()
    }
});
let isStopTalk = false
const synth = window.speechSynthesis;
function onMessageSend() {
    isStopTalk = false
    const input = inputElem.value.trim();
    const message = {
        content: input,
        role: "user",
    };
    if (input.length === 0) {
        return;
    }
    document.getElementById("send").disabled = true;

    messages.push(message);
    appendMessage(message);

    inputElem.value = "";
    inputElem
        .setAttribute("placeholder", "Enter text...");

    const aiMessage = {
        content: "typing...",
        role: "assistant",
    };
    appendMessage(aiMessage);

    const onFinishGenerating = (finalMessage) => {
        updateLastMessage(finalMessage);
        const utterance = new SpeechSynthesisUtterance(finalMessage);
        utterance.lang = "zh-CN"; // Simplified Chinese
        synth.speak(utterance);
        document.getElementById("send").disabled = false;
        // need button that cancels;
        engine.runtimeStatsText().then((statsText) => {
            document.getElementById("chat-stats").classList.remove("hidden");
            document.getElementById("chat-stats").textContent = statsText;
        });
    };

    streamingGenerating(
        messages,
        updateLastMessage,
        onFinishGenerating,
        console.error
    );
}

const getStopButton = () => {
    // remove others
    for (let elem of document.querySelectorAll('.stopTalk')) {
        elem.parentElement.removeChild(elem)
    }
    const stopTalkButton = document.createElement("button");
    stopTalkButton.textContent = 'Stop talking'
    stopTalkButton.classList.add("stopTalk");
    stopTalkButton.addEventListener('click', () => {
        // cancel any in-progress speeches
        synth.cancel();
        isStopTalk = true
    })
    return stopTalkButton
}
function appendMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const container = document.createElement("div");
    container.classList.add("message-container");
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");
    newMessage.textContent = message.content;
    container.appendChild(newMessage);

    if (message.role === "user") {
        container.classList.add("user");
    } else {
        container.classList.add("assistant");
        container.appendChild(getStopButton());
    }

    chatBox.appendChild(container);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

function updateLastMessage(content) {
    const messageDoms = document
        .getElementById("chat-box")
        .querySelectorAll(".message");
    const lastMessageDom = messageDoms[messageDoms.length - 1];
    lastMessageDom.textContent = content;
}

/*************** UI binding ***************/
availableModels.forEach((modelId) => {
    const option = document.createElement("option");
    option.value = modelId;
    option.textContent = modelId;
    document.getElementById("model-selection").appendChild(option);
});
document.getElementById("model-selection").value = selectedModel;
const downloadButton = document
    .getElementById("download")

downloadButton.addEventListener("click", function () {
    initializeWebLLMEngine().then(() => {
        document.getElementById("send").disabled = false;
    });
});
document.getElementById("send").addEventListener("click", function () {
    onMessageSend();
});

downloadButton.click()