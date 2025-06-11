import {
    pipeline,
    TextStreamer,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.0/+esm";

let generator;
let currentMessage = "";
let device = null;

if (navigator.gpu) {
    const adapter = await navigator.gpu.requestAdapter();
    if (adapter) {
        device = "webgpu";
    }
}

function progress_callback(e) {
    if (e.status == "progress") {
        let progress = parseInt(e.progress);
        self.postMessage(
            { type: "initialize", text: `Downloaded ${progress}%` }
        );
    }
}

self.onmessage = async (msg) => {
    msg = msg.data;
    if (msg.type == "initialize") {
        var llm = "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B";
        self.postMessage({
            type: "initialize",
            text: "Loading " + llm + "..."
        });
        generator = await pipeline("text-generation", llm, {
            dtype: "q4f16",
            device: device,
            progress_callback: progress_callback,
        });
        self.postMessage({
            type: "initialize",
            text: "Ready"
        });
    }

    if (msg.type == "submitPrompt") {
        let prompt = msg.prompt;
        currentMessage = "";
        self.postMessage({
            type: "responseHandling",
            text: "Generating response..."
        });
        const streamer = new TextStreamer(generator.tokenizer, {
            skip_prompt: true,
            callback_function: (text) => {
                currentMessage += text;
                self.postMessage(
                    { type: "stream", response: currentMessage }
                );
            },
        });
        let messages = [
            {
                role: "system",
                content: "You are a very helpful assistant."
            },
            {
                role: "user",
                content: prompt
            }
        ];
        const result = await generator(messages, {
            max_new_tokens: 1024,
            do_sample: true,
            streamer: streamer,
        });
        self.postMessage({
            type: "responseHandling",
            text: "Response complete."
        });
    }
}