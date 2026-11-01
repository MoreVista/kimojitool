// 奇文字生成・復号ツール

const MAX_ATTEMPTS = 100;
const ASCII_MIN = 32;  // Printable ASCII範囲
const ASCII_MAX = 126;

// 表示できる文字（文字・数字・記号・句読点）の判定用
// 制御文字・空白・サロゲート・結合文字・私用領域・未割り当て文字などは除外される
const displayableChar = /[\p{L}\p{N}\p{P}\p{S}]/u;

function isDisplayable(code) {
    return displayableChar.test(String.fromCharCode(code));
}

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

// 足すと sum になる2つの文字コードを返す
function getRandomPair(sum, retry, ignoreInvalid) {
    const fixedPair = [Math.floor(sum / 2), sum - Math.floor(sum / 2)];
    if (!retry) return fixedPair;

    // 表示できない文字も含める場合は、単純に2つに分ける
    if (ignoreInvalid) {
        const a = randomInt(0, sum);
        return [a, sum - a];
    }

    // 1. 2文字とも Printable ASCII にできる場合（合計 64〜252）は ASCII から選ぶ
    if (sum >= ASCII_MIN * 2 && sum <= ASCII_MAX * 2) {
        const a = randomInt(Math.max(ASCII_MIN, sum - ASCII_MAX), Math.min(ASCII_MAX, sum - ASCII_MIN));
        return [a, sum - a];
    }

    // 2. マルチバイト文字など：表示できる文字の組み合わせを探す
    if (sum > ASCII_MAX * 2) {
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            const a = randomInt(0, sum);
            const b = sum - a;
            if (isDisplayable(a) && isDisplayable(b)) return [a, b];
        }
    }

    // 3. スペースや一部の記号・数字など（合計 64 未満）は、普通に足すと
    //    どちらかが必ず制御文字になるため、16bit で桁あふれさせて表示できる文字を作る
    //    （a + b = sum + 0x10000 となり、復号時は下位16bitを取り出す）
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const a = randomInt(sum + 1, 0xFFFF);
        const b = sum + 0x10000 - a;
        if (isDisplayable(a) && isDisplayable(b)) return [a, b];
    }

    return fixedPair;
}

// 平文 ⇒ 奇文字
function encodeText() {
    let input = document.getElementById("inputText").value;
    let retry = document.getElementById("retryToggle").checked;
    let ignoreInvalid = document.getElementById("ignoreInvalidToggle").checked;
    let encodedStr = "";

    // 絵文字などの UTF-16 で2単位（サロゲートペア）になる文字も欠けないよう、
    // 1文字ずつではなく UTF-16 の1単位ずつ変換する
    for (let i = 0; i < input.length; i++) {
        let code = input.charCodeAt(i);
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
        decodedStr += String.fromCharCode((num1 + num2) & 0xFFFF); // 桁あふれ分は捨てる
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
