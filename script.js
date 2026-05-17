const markdownInput = document.getElementById ("markdownInput");
const preview = document.getElementById("preview");

const exemploInicial = [
    "# Meu título principal",
    "",
    "## Um subtítulo",
    "",
    "Este é um texto com **negrito**, *itálico* e `código inline`.",
    "",
    "- Primeiro item da lista",
    "- Segundo item da lista",
    "- Terceiro item da lista",
    "",
    "> Esta é uma citação em Markdown.",
    "",
    "[Acesse meu GitHub](https://github.com)",
    "",
    "---",
    "",
    "```",
    "const nome = 'Jheffs';",
    "console.log(nome);",
    "```",
].join("\n");

markdownInput.value = exemploInicial;

function escaparHTML(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function formatarTextoInline(texto) {
    return texto
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function converterMarkdown(markdown) {
    const linhas = markdown.replace(/\r\n/g, "\n").split("\n");

    let html = "";
    let dentroDaLista = false;
    let dentroDoCodigo = false;
    let codigoTemporario = [];

    function fecharLista() {
        if (dentroDaLista) {
            html += "</ul>";
            dentroDaLista = false;
        }
    }

    for  (let linha of linhas) {
        const linhaLimpa = linha.trim();

        if (linhaLimpa.startsWith("```")) {
            if (!dentroDoCodigo) {
                fecharLista();
                dentroDoCodigo = true;
                codigoTemporario = [];
            } else {
                dentroDoCodigo = false;
                html += `<pre><code>${escaparHTML(codigoTemporario.join("\n"))}</code></pre>`;
            }

            continue;
        }

        if (dentroDoCodigo) {
            codigoTemporario.push(linha);
            continue;
        }

        if (linhaLimpa === "") {
            fecharLista();
            html += "<br>";
            continue;
        }

        if (/^---+$/.test(linhaLimpa)){
            fecharLista();
            html += "<hr>";
            continue;
        }

        if (linha.startsWith("### ")) {
            fecharLista();
            const conteudo = escaparHTML(linha.replace("### ", ""));
            html += `<h3>${formatarTextoInline(conteudo)}</h3>`;
            continue;
        }


        if (linha.startsWith("## ")) {
            fecharLista();
            const conteudo = escaparHTML(linha.replace("## ", ""));
            html += `<h2>${formatarTextoInline(conteudo)}</h2>`;
            continue;
        }

        if (linha.startsWith("# ")) {
            fecharLista();
            const conteudo = escaparHTML(linha.replace("# ", ""));
            html += `<h1>${formatarTextoInline(conteudo)}</h1>`;
            continue;
        }

        if (linha.startsWith("> ")) {
            fecharLista();
            const conteudo = escaparHTML(linha.replace("> ", ""));
            html += `<blockquote>${formatarTextoInline(conteudo)}</blockquote>`;
            continue;
        }

        if (linha.startsWith("- ")) {
            if (!dentroDaLista) {
            html += "<ul>";
            dentroDaLista = true;
            }

            const conteudo = escaparHTML(linha.replace("- ", ""));
            html += `<li>${formatarTextoInline(conteudo)}</li>`;
            continue;
        }

        const conteudo = escaparHTML(linha);
        html +=`<p>${formatarTextoInline(conteudo)}</p>`;
    }

    fecharLista();  
    
    return html;
}

function atualizarPreview() {
    const textoDigitado = markdownInput.value;
    const htmlConvertido = converterMarkdown(textoDigitado);

    preview.innerHTML = htmlConvertido;
}

markdownInput.addEventListener("input", atualizarPreview);

atualizarPreview();