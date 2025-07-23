let personagem = {
  classe: "",
  forca: 10,
  sabedoria: 10,
  coragem: 10,
  percepcao: 10,
  magia: 10,
  inventario: [],
  tempo: 0
};

let historia = {};
let cenaAtual = "inicio";

// 🔄 Carrega a história do JSON
async function carregarHistoria() {
  const resposta = await fetch("data/historia.json");
  historia = await resposta.json();
}

// 🧙 Escolha de classe inicial
function escolherClasse(classe) {
  personagem.classe = classe;
  document.getElementById("classeSelecionada").textContent = classe;

  switch (classe) {
    case "mago":
      personagem.magia += 5;
      personagem.sabedoria += 3;
      break;
    case "guerreiro":
      personagem.forca += 5;
      personagem.coragem += 3;
      break;
    case "explorador":
      personagem.percepcao += 5;
      personagem.coragem += 2;
      break;
  }

  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("interface-jogo").style.display = "block";
  mostrarCena("inicio");
}

// 📜 Mostra a cena atual
function mostrarCena(cena) {
  cenaAtual = cena;
  const cenaData = historia[cena];
  personagem.tempo += (cenaData.tempo || 2);
  document.body.setAttribute("data-cena", nomeCena);


  // ✨ Atualiza título, texto e tempo
  document.getElementById("tituloCena").textContent = formatarTitulo(cena);
  document.getElementById("textoCena").textContent = cenaData.texto;
  document.getElementById("tempoTotal").textContent = personagem.tempo;

  // 🖼️ Verifica se imagem existe
  verificarImagem(cena).then(existe => {
    const imagem = existe ? `${cena}.png` : `inicio.png`;
    document.body.setAttribute("data-cena", cena);
    document.body.style.backgroundImage = `url('assets/images/${imagem}')`;
  });

  // 🧭 Limpa escolhas anteriores
  const escolhas = document.getElementById("escolhas");
  escolhas.innerHTML = "";

  for (let chave in cenaData.opcoes) {
    const botao = document.createElement("button");
    botao.textContent = cenaData.opcoes[chave];
    botao.onclick = () => {
      aplicarEfeitos(cena, chave);
      mostrarCena(chave);
    };
    escolhas.appendChild(botao);
  }

  atualizarPainel();
}

// 🔍 Verifica se imagem existe
async function verificarImagem(nome) {
  try {
    const resposta = await fetch(`assets/images/${nome}.png`, { method: "HEAD" });
    return resposta.ok;
  } catch {
    return false;
  }
}

// 🧪 Efeitos de escolhas específicas
function aplicarEfeitos(cena, escolha) {
  if (cena === "caverna_pacto" && escolha === "pacto_negado") {
    personagem.coragem += 5;
  }
  if (cena === "cristal" && escolha === "avancar_caverna") {
    personagem.magia += 10;
    personagem.inventario.push("Cristal de luz");
  }
  if (cena === "ajudar") {
    personagem.sabedoria += 2;
    personagem.inventario.push("Poção rara");
  }
  if (cena === "invocar_magia") {
    personagem.magia += 3;
    personagem.inventario.push("Artefato do Vento");
  }
}

// 📊 Atualiza atributos no painel
function atualizarPainel() {
  document.getElementById("forca").textContent = personagem.forca;
  document.getElementById("sabedoria").textContent = personagem.sabedoria;
  document.getElementById("coragem").textContent = personagem.coragem;
  document.getElementById("percepcao").textContent = personagem.percepcao;
  document.getElementById("magia").textContent = personagem.magia;
  document.getElementById("inventario").textContent = personagem.inventario.join(", ") || "Nada";
}

// 🔁 Reinicia o jogo
function reiniciar() {
  location.reload();
}

// 🏷️ Títulos amigáveis por cena
function formatarTitulo(cena) {
  const titulos = {
    inicio: "🌲 Despertar na Floresta",
    cachoeira: "🌊 Cachoeira das Lendas",
    cristal: "✨ O Cristal Místico",
    descansar: "🧘 Meditação Arcana",
    ruinas: "🏰 Ruínas Élficas",
    seguir_espirito: "👻 Visões do Pacto",
    guardar_info: "📓 Conhecimento Anotado",
    invocar_magia: "🌀 Portal Oculto",
    pegar_artefato: "💨 Artefato do Vento",
    ignorar_portal: "🚪 Portal Fechado",
    vilarejo: "🛖 Vilarejo dos Sobreviventes",
    ajudar: "🤝 Defesa do Vilarejo",
    descansar_vilarejo: "🛏️ Descanso Merecido",
    fonte_sombria: "🐛 Fonte Corrompida",
    purificar: "💧 Purificação Espiritual",
    voltar_vilarejo: "🎉 Vitória Celebrada",
    combater: "⚔️ Batalha contra o Espírito",
    caverna_pacto: "🔥 Caverna do Pacto",
    pacto_feito: "🩸 O Pacto Sombrio",
    pacto_negado: "⚔️ Resistência Interior",
    arvore_julgamento: "⚖️ Árvore do Julgamento",
    final_redentor: "🌟 Final Redentor",
    final_sombrio: "🩸 Final Sombrio",
    final_oculto: "🌀 Final Oculto"
  };
  return titulos[cena] || "📜 Cena";
}

document.addEventListener("click", () => {
  const musica = document.getElementById("musica");
  if (musica && musica.paused) {
    musica.play();
  }
}, { once: true });

// 🚀 Inicia carregamento da história ao abrir a página
window.onload = carregarHistoria;
