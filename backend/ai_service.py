import os
import re
import json
from llama_cpp import Llama

# ذاكرة الملاحظات والتغذية الراجعة
feedback_memory = {
    "liked_patterns": [
        "Complete, fully-functional React components with matching CSS",
        "Self-contained state management with functional buttons and UI"
    ],
    "disliked_patterns": [
        "Incomplete or cut-off code strings",
        "Missing closing tags or unclosed JSON quotes"
    ]
}

SYSTEM_PROMPT = """You are a full-stack React UI generator.
You MUST write COMPLETE, FULLY WORKING, and FULLY CLOSED React code and CSS in JSON format.

CRITICAL INSTRUCTIONS:
1. Output MUST be a valid JSON object with keys "App.jsx" and "styles.css".
2. "App.jsx" must be a SELF-CONTAINED, FULLY FUNCTIONAL component that renders completely without missing tags or undefined imports.
3. Keep the JSX structure concise enough to complete fully within the token limit. ALWAYS close all tags, components, and functions.
4. NO third-party package imports (NO react-bootstrap, NO react-router-dom). Use standard React hooks and HTML tags.
5. NO markdown formatting."""

JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "App.jsx": {"type": "string"},
        "styles.css": {"type": "string"}
    },
    "required": ["App.jsx", "styles.css"]
}

# تحميل النموذج
print("⏳ Loading Qwen2.5-Coder-3B GGUF model for CPU...")
cpu_threads = max(1, os.cpu_count() or 2)

llm = Llama.from_pretrained(
    repo_id="Qwen/Qwen2.5-Coder-3B-Instruct-GGUF",
    filename="*q4_k_m.gguf",
    n_ctx=2048,
    n_threads=cpu_threads,
    n_batch=512
)
print("✅ 3B GGUF Model loaded successfully!")


def format_code_string(code_str: str) -> str:
    if not isinstance(code_str, str):
        return str(code_str)
    formatted = re.sub(r';\s*,', ';\n', code_str)
    formatted = formatted.replace('\\n', '\n')
    return formatted


def parse_generated_response(text: str) -> dict:
    try:
        clean_text = re.sub(r"```(?:json)?", "", text, flags=re.IGNORECASE).strip()
        json_match = re.search(r"\{[\s\S]*\}", clean_text)
        if json_match:
            json_str = json_match.group(0)
            try:
                data = json.loads(json_str)
            except json.JSONDecodeError:
                if not json_str.endswith("}"):
                    json_str += '"}'
                fixed_json = re.sub(
                    r'(?s)"([^"\\]*(?:\\.[^"\\]*)*)"',
                    lambda m: m.group(0).replace('\n', '\\n').replace('\r', ''),
                    json_str
                )
                data = json.loads(fixed_json)

            if isinstance(data, dict):
                app_code = format_code_string(data.get("App.jsx", data.get("App.js", text)))
                css_code = format_code_string(data.get("styles.css", "/* CSS Styles */"))
                return {
                    "App.jsx": app_code,
                    "styles.css": css_code
                }
    except Exception as e:
        print(f"❌ JSON Parsing Error: {e}")

    return {
        "App.jsx": format_code_string(text),
        "styles.css": "/* CSS Styles */"
    }


def generate_react_code(prompt: str) -> dict:
    """توليد الكود باستخدام نموذج الذكاء الاصطناعي"""
    try:
        response = llm.create_chat_completion(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Generate COMPLETE working React code for: {prompt}"}
            ],
            max_tokens=750,
            temperature=0.1,
            response_format={
                "type": "json_object",
                "schema": JSON_SCHEMA
            }
        )

        raw_output = response["choices"][0]["message"]["content"]
        return parse_generated_response(raw_output)

    except Exception as e:
        return {
            "App.jsx": f"export default function Error() {{ return <div>Error: {str(e)}</div>; }}",
            "styles.css": "body { color: red; padding: 20px; }"
        }