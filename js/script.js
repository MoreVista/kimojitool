// 奇文字生成・復号ツール

// 合計が sum になる2つの文字コードを返す
function getRandomPair(sum, retry, ignoreInvalid) {
    let a, b;
    let maxAttempts = 100;
    let attempts = 0;

    do {
        a = Math.floor(Math.random() * (sum + 1));
        b = sum - a;
        attempts++;
        if (!retry || attempts > maxAttempts) {
            return [Math.floor(sum / 2), sum - Math.floor(sum / 2)];
        }
    } while (!isValidChar(a, ignoreInvalid) || !isValidChar(b, ignoreInvalid));
    return [a, b];
}

function isValidChar(code, ignoreInvalid) {
    if (ignoreInvalid) return true;
    return code >= 32 && code <= 126; // Printable ASCII範囲
}

// 平文 ⇒ 奇文字
function encodeText() {
    let input = document.getElementById("inputText").value;
    let retry = document.getElementById("retryToggle").checked;
    let ignoreInvalid = document.getElementById("ignoreInvalidToggle").checked;
    let encodedStr = "";

    for (let char of input) {
        let code = char.charCodeAt(0);
        let [num1, num2] = getRandomPair(code, retry, ignoreInvalid);
        encodedStr += String.fromCharCode(num1) + String.fromCharCode(num2);
    }
    document.getElementById("outputText").innerText = encodedStr;
}

// 奇文字 ⇒ 平文
function decodeText() {
    let encodedStr = document.getElementById("outputText").innerText;
    let decodedStr = "";

    for (let i = 0; i < encodedStr.length; i += 2) {
        let num1 = encodedStr.charCodeAt(i);
        let num2 = encodedStr.charCodeAt(i + 1);
        decodedStr += String.fromCharCode(num1 + num2);
    }
    document.getElementById("outputText").innerText = decodedStr;
}

function copyToClipboard() {
    let outputText = document.getElementById("outputText").innerText;
    navigator.clipboard.writeText(outputText).then(() => {
        alert("コピーしました！");
    }).catch(err => {
        alert("コピーに失敗しました: " + err);
    });
}

// ボタンにイベントを登録
document.getElementById("encodeButton").addEventListener("click", encodeText);
document.getElementById("decodeButton").addEventListener("click", decodeText);
document.getElementById("copyButton").addEventListener("click", copyToClipboard);
