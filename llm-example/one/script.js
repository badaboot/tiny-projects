var llmReady = false;

function updateStatus(msg) {
    document.getElementById("llm_status").innerText = msg;
}

const blob = new Blob(
    Array.prototype.map.call(
        document.querySelectorAll("script[type='text/js-worker']"),
        (script) => script.textContent
    ),
    { type: "text/javascript" }
);

var worker = new Worker(window.URL.createObjectURL(blob), {
    type: "module",
});

worker.onmessage = (event) => {
    event = event.data;
    if (event.type === "initialize") {
        updateStatus(event.text);
        if (event.text === "Ready") {
            llmReady = true;
            document.getElementById("user_input").disabled = false;
            document.getElementById("user_input").placeholder =
                "Type prompt here...";
            document.getElementById("submit").disabled = false;
            document.getElementById("submit").value = "Submit Prompt";
        }
    }
    if (event.type === "responseHandling") {
        updateStatus(event.text);
    }
    if (event.type === "stream") {
        document.getElementById("llm_response").innerText = event.response;
    }
};

document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    if (!llmReady) {
        updateStatus("Preparing to load LLM...");
        document.getElementById("submit").disabled = true;
        worker.postMessage({
            type: "initialize",
        });
    } else {
        worker.postMessage({
            type: "submitPrompt",
            prompt: document.getElementById("user_input").value,
        });
        document.getElementById("user_input").value = "";
    }
});