const tamanho = 5;
const numNavios = 3;
let navios = [];
let acertos = 0;
let fimDeJogo = false;

// Gerar tabuleiro (já implementado)
const tabuleiro = document.getElementById("tabuleiro");
for (let y = 0; y < tamanho; y++) {
  for (let x = 0; x < tamanho; x++) {
    const celula = document.createElement("div");
    celula.classList.add("celula");
    celula.dataset.x = x;
    celula.dataset.y = y;
    celula.addEventListener("click", aoClicarNaCelula);
    tabuleiro.appendChild(celula);
  }
}

// ==========================
// Função para gerar navios
// ==========================
/**
 * Gera posições aleatórias e únicas para os navios no tabuleiro.
 * @returns {Array<Object>} Um array de objetos, onde cada objeto representa a coordenada {x, y} de um navio.
 */
function gerarNavios() {
  const posicoes = [];

  // IMPLEMENTAR: gerar coordenadas únicas até completar numNavios
  while (posicoes.length < numNavios) {
    const x = Math.floor(Math.random() * tamanho);
    const y = Math.floor(Math.random() * tamanho);

    // Verifica se a posição gerada já existe no array
    // A função 'some' retorna true se pelo menos um item do array satisfaz a condição
    const posicaoJaExiste = posicoes.some(p => p.x === x && p.y === y);

    if (!posicaoJaExiste) {
      posicoes.push({ x, y });
    }
  }

  return posicoes; // Deve retornar array de objetos {x, y}
}

// Chamada inicial da função (não altere)
navios = gerarNavios();
// Para depuração, você pode ver as posições no console:
console.log("Posições dos navios (gabarito):", navios);


// ==============================
// Função para tratar cliques
// ==============================
/**
 * Função executada quando uma célula do tabuleiro é clicada.
 * Verifica se foi um acerto ou erro, atualiza a UI e o estado do jogo.
 * @param {Event} event - O evento de clique.
 */
function aoClicarNaCelula(event) {
  // Se o jogo já terminou, não faz mais nada
  if (fimDeJogo) {
    return;
  }

  const celula = event.currentTarget;
  const x = parseInt(celula.dataset.x);
  const y = parseInt(celula.dataset.y);
  const mensagem = document.getElementById("mensagem");

  // TODO: Impedir clique repetido
  // Se a célula já tem conteúdo (💥 ou 🌊), significa que já foi clicada.
  if (celula.textContent !== "") {
    mensagem.textContent = "Você já atacou esta posição. Tente outra.";
    return;
  }

  // TODO: Verificar se o clique foi acerto ou erro
  // A função 'some' verifica se alguma das posições de navio corresponde ao clique
  const acertou = navios.some(navio => navio.x === x && navio.y === y);

  if (acertou) {
    // TODO: Marcar visualmente o resultado (💥 ou 🌊)
    celula.textContent = "💥";
    celula.classList.add("acertou");
    mensagem.textContent = "Você acertou um navio!";
    acertos++;

    // TODO: Encerrar jogo ao afundar todos os navios
    if (acertos === numNavios) {
      fimDeJogo = true;
      mensagem.textContent = "Vitória! Você afundou todos os navios!";
    }
  } else {
    celula.textContent = "🌊";
    celula.classList.add("errou");
    mensagem.textContent = "Água! Tente novamente.";
  }
}

// ==============================
// Testes Unitários no Console
// ==============================

// ** Teste 1: Geração de Navios **
function testarGeracaoDeNavios() {
  console.group("Teste 1: Geração de Navios");
  const n = gerarNavios();

  // Teste 1.1 - quantidade correta
  console.log("1.1 - Quantidade correta:", n.length === numNavios, `(Esperado: ${numNavios}, Recebido: ${n.length})`);

  // Teste 1.2 - posições únicas
  const unicos = new Set(n.map(p => `${p.x},${p.y}`));
  console.log("1.2 - Sem repetições:", unicos.size === numNavios, `(Esperado: ${numNavios} posições únicas)`);

  // Teste 1.3 - dentro do tabuleiro
  const dentroDosLimites = n.every(p => p.x >= 0 && p.x < tamanho && p.y >= 0 && p.y < tamanho);
  console.log("1.3 - Dentro do tabuleiro:", dentroDosLimites, `(Todas as coordenadas devem estar entre 0 e ${tamanho - 1})`);
  console.groupEnd();
}

// ** Teste 2: Lógica de Clique e Finalização **
function testarLogicaDeCliqueEFinalizacao() {
  console.group("Teste 2: Lógica de Clique e Finalização");

  // Prepara um cenário de teste controlado
  navios = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 0, y: 0 }];
  acertos = 0;
  fimDeJogo = false;

  // 2.1 - Testa um clique em posição de ACERTO
  const celulaAcerto = document.querySelector('[data-x="1"][data-y="1"]');
  aoClicarNaCelula({ currentTarget: celulaAcerto });
  console.log("2.1 - Clique em ACERTO:", celulaAcerto.textContent === "💥" && acertos === 1);

  // 2.2 - Testa um clique em posição de ERRO
  const celulaErro = document.querySelector('[data-x="3"][data-y="3"]');
  aoClicarNaCelula({ currentTarget: celulaErro });
  console.log("2.2 - Clique em ERRO:", celulaErro.textContent === "🌊");

  // 2.3 - Testa se o jogo reconhece o fim após 3 acertos
  const celulaAcerto2 = document.querySelector('[data-x="2"][data-y="2"]');
  aoClicarNaCelula({ currentTarget: celulaAcerto2 });
  const celulaAcerto3 = document.querySelector('[data-x="0"][data-y="0"]');
  aoClicarNaCelula({ currentTarget: celulaAcerto3 });

  console.log("2.3 - Reconhece FIM DE JOGO:", fimDeJogo === true && acertos === 3);

  // Limpa o tabuleiro para poder jogar de verdade depois dos testes
  document.querySelectorAll('.celula').forEach(c => {
    c.textContent = '';
    c.classList.remove('acertou', 'errou');
  });
  console.groupEnd();
}

// --- Execução dos Testes ---
testarGeracaoDeNavios();
testarLogicaDeCliqueEFinalizacao();

// --- Reinicia o jogo para o jogador ---
navios = gerarNavios();
acertos = 0;
fimDeJogo = false;
document.getElementById("mensagem").textContent = "Clique em uma célula para atacar.";
console.log("Jogo reiniciado para o jogador. Gabarito dos novos navios:", navios);