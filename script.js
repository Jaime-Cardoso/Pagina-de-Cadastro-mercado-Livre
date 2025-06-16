document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const isValid = validarFormulario(form);
            if (isValid) {
                alert("Formulário enviado com sucesso!");
                form.reset();
            }
        });
    });
});

function validarFormulario(form) {
    let valido = true;
    let mensagens = [];

    const campos = form.querySelectorAll("input, textarea");

    campos.forEach(campo => {
        const nome = campo.name;
        const valor = campo.value.trim();

        // Campos obrigatórios
        if (!valor) {
            mensagens.push(`O campo "${nome}" é obrigatório.`);
            valido = false;
            return;
        }

        // Validação de nome: só letras e espaços
        if (nome === "nome") {
            const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;
            if (!regexNome.test(valor)) {
                mensagens.push("Nome inválido. Use apenas letras e espaços.");
                valido = false;
            }
        }

        // Validação de CPF real
        if (nome === "cpf") {
            if (!validarCPF(valor)) {
                mensagens.push("CPF inválido. Insira um CPF numérico e válido.");
                valido = false;
            }
        }

        // Validação de telefone (só números, 10 ou 11 dígitos)
        if (nome === "telefone") {
            const regexTel = /^\d{10,11}$/;
            if (!regexTel.test(valor)) {
                mensagens.push("Telefone inválido. Use apenas números com DDD.");
                valido = false;
            }
        }

        // Endereço: mínimo 5 caracteres
        if (nome === "endereco") {
            if (valor.length < 5) {
                mensagens.push("Endereço muito curto.");
                valido = false;
            }
        }

        // E-mail
        if (nome === "email") {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(valor)) {
                mensagens.push("E-mail inválido.");
                valido = false;
            }
        }

        // Senha
        if (nome === "senha") {
            if (valor.length < 6) {
                mensagens.push("A senha deve conter no mínimo 6 caracteres.");
                valido = false;
            }
        }

        // Banco, agência e conta (apenas números com 3 ou mais dígitos)
        if (["banco", "agencia", "conta"].includes(nome)) {
            const regexNumeros = /^\d{3,}$/;
            if (!regexNumeros.test(valor)) {
                mensagens.push(`O campo "${nome}" deve conter ao menos 3 dígitos numéricos.`);
                valido = false;
            }
        }

        // Preço do produto
        if (nome === "preco") {
            const preco = parseFloat(valor.replace(",", "."));
            if (isNaN(preco) || preco <= 0) {
                mensagens.push("Preço inválido. Deve ser um número maior que zero.");
                valido = false;
            }
        }
    });

    if (!valido) {
        alert("Erros encontrados:\n\n" + mensagens.join("\n"));
    }

    return valido;
}

// Validador real de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let digito1 = 11 - (soma % 11);
    if (digito1 >= 10) digito1 = 0;

    if (parseInt(cpf.charAt(9)) !== digito1) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    let digito2 = 11 - (soma % 11);
    if (digito2 >= 10) digito2 = 0;

    return parseInt(cpf.charAt(10)) === digito2;
}
