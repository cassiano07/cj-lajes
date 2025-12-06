const priceInput = document.getElementById("price-input");

priceInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // Remove tudo que não for número
    value = value.replace(/\D/g, "");

    // Se estiver vazio, limpa
    if (!value) {
        e.target.value = "";
        return;
    }

    // Converte para centavos → reais
    value = (Number(value) / 100).toFixed(2);

    // Formata para BRL
    e.target.value = Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
});

function getCurrencyNumber(formattedValue) {
    return Number(
        formattedValue
            .replace(/\s/g, "")   // remove espaços (some browsers colocam)
            .replace("R$", "")    // remove R$
            .replace(/\./g, "")   // remove pontos
            .replace(",", ".")    // troca vírgula por ponto
    );
}

const calculatorBtn = document.getElementById("calculator-btn");
const results = document.getElementById("results");

const formatNumber = (value) => Number(value).toFixed(2);

const formatCurrency = (value) =>
    Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

async function checkSession() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
        showApp();
    } else {
        showAuth();
    }
}

function showApp() {
    results.style.display = "block";
}

function showAuth() {
    authSection.style.display = "block";
    appSection.style.display = "none";
}

// Login
calculatorBtn.onclick = async () => {
    const price = getCurrencyNumber(document.getElementById("price-input").value);

    // valores em cm
    const calWidthCm = Number(document.getElementById("cal-width").value);
    const calLengthCm = Number(document.getElementById("cal-length").value);
    const calCheck = document.getElementById("cal-check").checked;

    // converter para metros
    const calWidth = calWidthCm / 100;
    const calLength = calLengthCm / 100;

    // cálculos
    const m2 = calWidth * calLength;            // agora está em m²
    const beamCount = (calCheck ? calLength : calWidth) / 0.42;
    const styrofoam = m2 * 2;
    const chargeAmount = (m2 * price).toFixed(2).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // exibir formatado
    document.getElementById("m2").textContent = formatNumber(m2);
    document.getElementById("beam").textContent = formatNumber(beamCount);
    document.getElementById("styrofoam").textContent = formatNumber(styrofoam);
    document.getElementById("amount").textContent = formatCurrency(chargeAmount);
};

// Registra PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}

