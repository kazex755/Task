import { useEffect, useMemo, useState } from "react";
import "./App.css";

const RANKS = ["E", "F", "D", "C", "B", "A", "S", "SS", "NATIONAL"];
const RANK_INDEX = Object.fromEntries(RANKS.map((r, i) => [r, i + 1]));

const CLASS_DATA = {
  "Sem Classe": { foco: "forca", habilidades: [] },
  Guerreiro: {
    foco: "forca",
    habilidades: [
      { nome: "Golpe Devastador", tipo: "dano", custoMana: 20, cooldown: 2, power: 2.6 },
      { nome: "Fúria Berserker", tipo: "buff", custoMana: 35, cooldown: 5, bonusDano: 18, turnos: 3 },
    ],
  },
  Assassino: {
    foco: "agilidade",
    habilidades: [
      { nome: "Ataque Furtivo", tipo: "dano", custoMana: 18, cooldown: 2, power: 2.9 },
      { nome: "Corte Fantasma", tipo: "dano", custoMana: 40, cooldown: 5, power: 4.7 },
    ],
  },
  Mago: {
    foco: "inteligencia",
    habilidades: [
      { nome: "Meteoro Arcano", tipo: "dano", custoMana: 30, cooldown: 3, power: 3.9 },
      { nome: "Tempestade Cósmica", tipo: "dano", custoMana: 60, cooldown: 6, power: 6.5 },
    ],
  },
  Paladino: {
    foco: "vitalidade",
    habilidades: [
      { nome: "Luz Sagrada", tipo: "cura", custoMana: 25, cooldown: 3, healPower: 2.8 },
      { nome: "Julgamento Divino", tipo: "dano", custoMana: 45, cooldown: 5, power: 4.8 },
    ],
  },
  Necromante: {
    foco: "inteligencia",
    habilidades: [
      { nome: "Extração de Sombras", tipo: "invocacao", custoMana: 30, cooldown: 4, power: 3.0 },
      { nome: "Exército Sombrio", tipo: "dano", custoMana: 80, cooldown: 8, power: 6.8 },
    ],
  },
  Arqueiro: {
    foco: "agilidade",
    habilidades: [
      { nome: "Tiro Preciso", tipo: "dano", custoMana: 12, cooldown: 1, power: 2.4, critBonus: 15 },
      { nome: "Chuva de Flechas", tipo: "dano", custoMana: 40, cooldown: 4, power: 4.2 },
    ],
  },
  Monge: {
    foco: "vitalidade",
    habilidades: [
      { nome: "Punho do Vazio", tipo: "dano", custoMana: 18, cooldown: 2, power: 2.8 },
      { nome: "Passo Ilusório", tipo: "buff", custoMana: 28, cooldown: 4, esquivaBonus: 20, turnos: 3 },
    ],
  },
  Berserker: {
    foco: "forca",
    habilidades: [
      { nome: "Fenda Brutal", tipo: "dano", custoMana: 20, cooldown: 2, power: 3.2 },
      { nome: "Sede de Guerra", tipo: "buff", custoMana: 35, cooldown: 5, bonusDano: 25, rouboVida: 0.12, turnos: 3 },
    ],
  },
  Ilusionista: {
    foco: "inteligencia",
    habilidades: [
      { nome: "Labirinto Mental", tipo: "debuff", custoMana: 20, cooldown: 2, power: 2.5 },
      { nome: "Imagem Espelhada", tipo: "buff", custoMana: 32, cooldown: 5, esquivaBonus: 25, turnos: 3 },
    ],
  },
};

const LOJA = {
  equipamentos: [
    { id: "eq1", nome: "Adaga de Aço", preco: 150, bonus: { forca: 3 }, desc: "+3 Força" },
    { id: "eq2", nome: "Manto do Assassino", preco: 400, bonus: { agilidade: 8 }, desc: "+8 Agilidade" },
    { id: "eq3", nome: "Armadura do Cavaleiro", preco: 1200, bonus: { vitalidade: 20 }, desc: "+20 Vitalidade" },
    { id: "eq4", nome: "Lâmina de Kamish", preco: 5000, bonus: { forca: 60, agilidade: 40 }, desc: "+60 Força, +40 Agilidade" },
    { id: "eq5", nome: "Anel do Regenerador", preco: 1800, bonus: { vitalidade: 12, inteligencia: 6 }, desc: "+12 Vitalidade, +6 Inteligência" },
    { id: "eq6", nome: "Grevas do Guardião", preco: 900, bonus: { vitalidade: 8, forca: 4 }, desc: "+8 Vitalidade, +4 Força" },
  ],
  pocoes: [
    { id: "po1", nome: "Poção de Força", preco: 100, efeito: { forca: 1 }, desc: "+1 Força permanente" },
    { id: "po2", nome: "Poção Abençoada de Status", preco: 1500, efeito: { forca: 5, agilidade: 5, vitalidade: 5, inteligencia: 5 }, desc: "+5 em todos os status" },
    { id: "po3", nome: "Gota de Sangue de Dragão Antigo", preco: 6000, efeito: { forca: 25, agilidade: 25, vitalidade: 25, inteligencia: 25 }, desc: "+25 em todos os status" },
  ],
  consumiveis: [
    { id: "co1", nome: "Poção de Cura Menor", preco: 80, cura: 35, limpaDebuffs: true, desc: "Cura 35 HP e remove debuffs" },
    { id: "co2", nome: "Poção de Cura Maior", preco: 250, cura: 100, limpaDebuffs: true, desc: "Cura 100 HP e remove debuffs" },
    { id: "co3", nome: "Antídoto Arcano", preco: 150, cura: 10, limpaDebuffs: true, desc: "Remove todos os debuffs" },
    { id: "co4", nome: "Éter de Recuperação", preco: 500, cura: 240, limpaDebuffs: true, desc: "Cura grande e purifica o corpo" },
    { id: "co5", nome: "Poção de Mana", preco: 180, mana: 150, limpaDebuffs: false, desc: "Recupera mana" },
  ],
  reliquias: [
    { id: "re1", nome: "Olho de Odin", preco: 20000, bonus: { critico: 15 }, desc: "+15% Crítico" },
    { id: "re2", nome: "Coração do Dragão", preco: 50000, bonus: { regeneracao: 120 }, desc: "Regenera HP fora de combate" },
    { id: "re3", nome: "Coroa do Monarca", preco: 80000, bonus: { xpBonus: 0.15 }, desc: "+15% XP ganho" },
  ],
  pets: [
    { id: "pt1", nome: "Lobo de Sombras", preco: 2000, bonus: { dano: 8 }, desc: "Ajuda em combate e aumenta dano" },
    { id: "pt2", nome: "Fênix Lunar", preco: 9000, bonus: { cura: 25 }, desc: "Recupera HP após lutas" },
    { id: "pt3", nome: "Dragão Jovem", preco: 24000, bonus: { dano: 18, critico: 5 }, desc: "Pet lendário com alto dano" },
  ],
};

const MONSTROS = [
  { nome: "Goblin de Elite", rank: "E", vida: 30, ataque: 5, recompensa: 20, debuff: "sangramento" },
  { nome: "Lobo Sombrio", rank: "F", vida: 60, ataque: 8, recompensa: 40, debuff: "veneno" },
  { nome: "Golem de Pedra", rank: "D", vida: 120, ataque: 15, recompensa: 80, debuff: "atordoamento" },
  { nome: "Cachorro Infernal", rank: "C", vida: 240, ataque: 28, recompensa: 160, debuff: "chamas" },
  { nome: "Elfo Sombrio", rank: "B", vida: 420, ataque: 42, recompensa: 350, debuff: "cegueira" },
  { nome: "Baruka", rank: "A", vida: 900, ataque: 70, recompensa: 900, debuff: "sono" },
  { nome: "Antares", rank: "S", vida: 1800, ataque: 130, recompensa: 2500, debuff: "queimadura" },
  { nome: "Monarca da Destruição", rank: "SS", vida: 4000, ataque: 240, recompensa: 6000, debuff: "veneno" },
  { nome: "Monarca das Sombras", rank: "NATIONAL", vida: 9000, ataque: 420, recompensa: 15000, debuff: "chamas" },
];

const DEUSES = [
  {
    nome: "Ignaros, Deus das Chamas Eternas",
    rank: "DIVINO",
    vida: 25000,
    ataque: 950,
    recompensa: 50000,
    bencao: {
      nome: "Chamas Eternas",
      descricao: "Ataques aplicam queimadura e aumentam dano de fogo.",
      bonus: { forca: 120, danoFogo: true },
    },
  },
  {
    nome: "Nythera, Deusa da Noite Absoluta",
    rank: "DIVINO",
    vida: 32000,
    ataque: 1100,
    recompensa: 70000,
    bencao: {
      nome: "Olhos do Vazio",
      descricao: "Chance alta de esquiva e golpes que atravessam defesa.",
      bonus: { agilidade: 180, esquivaDivina: true },
    },
  },
  {
    nome: "Astrael, Deus do Tempo",
    rank: "DIVINO",
    vida: 50000,
    ataque: 1400,
    recompensa: 120000,
    bencao: {
      nome: "Tempo Congelado",
      descricao: "Chance de agir duas vezes e desacelerar inimigos.",
      bonus: { inteligencia: 220, turnoExtra: true },
    },
  },
];

function criarStatusInicial() {
  return {
    nivel: 1,
    rank: "E",
    xp: 0,
    xpNecessario: 100,
    ouro: 0,
    classe: "Sem Classe",
    baseAtributos: { forca: 10, agilidade: 10, vitalidade: 10, inteligencia: 10 },
    vidaMaxima: 100,
    vidaAtual: 100,
    manaMaxima: 100,
    manaAtual: 100,
    critico: 5,
    esquiva: 5,
    habilidades: [],
    equipamentos: [],
    inventario: [],
    pets: [],
    sombras: [],
    reliquias: [],
    titulos: [],
    bencaos: [],
    debuffs: [],
    cooldowns: {},
    tituloDivino: null,
  };
}

function calcularRank(nivel) {
  if (nivel >= 1280) return "NATIONAL";
  if (nivel >= 640) return "SS";
  if (nivel >= 320) return "S";
  if (nivel >= 160) return "A";
  if (nivel >= 80) return "B";
  if (nivel >= 40) return "C";
  if (nivel >= 20) return "D";
  if (nivel >= 10) return "F";
  return "E";
}

function calcularHP(level, vitalidade) {
  const rank = calcularRank(level);
  const fator = { E: 1, F: 1.2, D: 1.6, C: 2.2, B: 3.2, A: 5, S: 8, SS: 14, NATIONAL: 28 };
  return Math.floor(vitalidade * 10 * (fator[rank] || 1));
}

function multiplicadorDano(rankPlayer, rankMonstro) {
  const p = RANK_INDEX[rankPlayer] || 1;
  const m = RANK_INDEX[rankMonstro] || 1;
  const diff = m - p;

  if (diff >= 4) return 4.5;
  if (diff === 3) return 3.2;
  if (diff === 2) return 2.2;
  if (diff === 1) return 1.5;
  if (diff === 0) return 1;
  if (diff === -1) return 0.75;
  if (diff === -2) return 0.5;
  if (diff <= -3) return 0.3;
  return 1;
}

function obterClassePadrao(baseAtributos) {
  if (baseAtributos.forca >= baseAtributos.agilidade && baseAtributos.forca >= baseAtributos.inteligencia) return "Guerreiro";
  if (baseAtributos.agilidade >= baseAtributos.inteligencia) return "Assassino";
  return "Mago";
}

function aplicarLevelUp(prev, xpGanho) {
  let xp = prev.xp + xpGanho;
  let nivel = prev.nivel;
  let xpNecessario = prev.xpNecessario;
  let baseAtributos = { ...prev.baseAtributos };

  while (xp >= xpNecessario) {
    xp -= xpNecessario;
    nivel += 1;
    xpNecessario = Math.floor(xpNecessario * 1.5);
    baseAtributos.forca += 2;
    baseAtributos.agilidade += 2;
    baseAtributos.vitalidade += 2;
    baseAtributos.inteligencia += 2;
  }

  const rank = calcularRank(nivel);
  const vidaMaxima = calcularHP(nivel, baseAtributos.vitalidade);
  const manaMaxima = baseAtributos.inteligencia * 10;

  let classe = prev.classe;
  let habilidades = prev.habilidades;

  if (prev.classe === "Sem Classe" && nivel >= 10) {
    classe = obterClassePadrao(baseAtributos);
    habilidades = [...habilidades, ...(CLASS_DATA[classe]?.habilidades || [])];
  }

  return {
    ...prev,
    xp,
    nivel,
    rank,
    xpNecessario,
    baseAtributos,
    classe,
    habilidades,
    vidaMaxima,
    vidaAtual: Math.min(prev.vidaAtual, vidaMaxima),
    manaMaxima,
    manaAtual: Math.min(prev.manaAtual, manaMaxima),
  };
}

function App() {
  const [statusUsuario, setStatusUsuario] = useState(() => {
    const salvo = localStorage.getItem("rpg-status");
    if (!salvo) return criarStatusInicial();

    try {
      const p = JSON.parse(salvo);
      return {
        ...criarStatusInicial(),
        ...p,
        baseAtributos: p.baseAtributos ?? criarStatusInicial().baseAtributos,
        equipamentos: p.equipamentos ?? [],
        inventario: p.inventario ?? [],
        pets: p.pets ?? [],
        sombras: p.sombras ?? [],
        reliquias: p.reliquias ?? [],
        titulos: p.titulos ?? [],
        bencaos: p.bencaos ?? [],
        debuffs: p.debuffs ?? [],
        cooldowns: p.cooldowns ?? {},
      };
    } catch {
      return criarStatusInicial();
    }
  });

  const [lista, setLista] = useState(() => {
    const salva = localStorage.getItem("rpg-tarefas");
    if (!salva) return [];
    try {
      return JSON.parse(salva);
    } catch {
      return [];
    }
  });

  const [modo, setModo] = useState(() => localStorage.getItem("modo-escuro") !== "false");
  const [input, setInput] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horario, setHorario] = useState("");
  const [tipoMissao, setTipoMissao] = useState("secundaria");
  const [diasRepeticao, setDiasRepeticao] = useState([]);
  const [notificacao, setNotificacao] = useState({ mensagem: "", tipo: "" });
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, idTarefa: null });
  const [inimigo, setInimigo] = useState(null);
  const [logsCombate, setLogsCombate] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("missoes");

  const atributosAtuais = useMemo(() => {
    const somarBonus = (itens) =>
      itens.reduce(
        (acc, item) => {
          acc.forca += item.bonus?.forca || 0;
          acc.agilidade += item.bonus?.agilidade || 0;
          acc.vitalidade += item.bonus?.vitalidade || 0;
          acc.inteligencia += item.bonus?.inteligencia || 0;
          acc.critico += item.bonus?.critico || 0;
          return acc;
        },
        { forca: 0, agilidade: 0, vitalidade: 0, inteligencia: 0, critico: 0 }
      );

    const eq = somarBonus(statusUsuario.equipamentos);
    const pet = somarBonus(statusUsuario.pets);
    const rel = somarBonus(statusUsuario.reliquias);
    const ben = somarBonus(statusUsuario.bencaos);

    return {
      forca: statusUsuario.baseAtributos.forca + eq.forca + pet.forca + rel.forca + ben.forca,
      agilidade: statusUsuario.baseAtributos.agilidade + eq.agilidade + pet.agilidade + rel.agilidade + ben.agilidade,
      vitalidade: statusUsuario.baseAtributos.vitalidade + eq.vitalidade + pet.vitalidade + rel.vitalidade + ben.vitalidade,
      inteligencia: statusUsuario.baseAtributos.inteligencia + eq.inteligencia + pet.inteligencia + rel.inteligencia + ben.inteligencia,
      critico: statusUsuario.critico + pet.critico + rel.critico + ben.critico,
      esquiva: statusUsuario.esquiva,
    };
  }, [statusUsuario]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", modo ? "dark" : "light");
    localStorage.setItem("modo-escuro", String(modo));
  }, [modo]);

  useEffect(() => {
    localStorage.setItem("rpg-status", JSON.stringify(statusUsuario));
  }, [statusUsuario]);

  useEffect(() => {
    localStorage.setItem("rpg-tarefas", JSON.stringify(lista));
  }, [lista]);

  useEffect(() => {
    const interval = setInterval(() => {
      const agora = new Date();
      const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
      const diaAtual = agora.getDay();

      lista.forEach((tarefa) => {
        const ativaHoje = (tarefa.diasAtivos?.length || 0) === 0 || tarefa.diasAtivos.includes(diaAtual);
        if (ativaHoje && tarefa.horario === horaAtual && !tarefa.concluida && !tarefa.alarmeDisparado) {
          mostrarAviso(`🚨 MISSÃO DETECTADA: ${tarefa.texto}`, "erro");
          setLista((prev) => prev.map((item) => (item.id === tarefa.id ? { ...item, alarmeDisparado: true } : item)));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lista]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusUsuario((prev) => {
        if (!prev.debuffs.length) return prev;

        let dano = 0;
        const novosDebuffs = prev.debuffs
          .map((d) => {
            if (d.tipo === "chamas") dano += 6;
            if (d.tipo === "veneno") dano += 5;
            if (d.tipo === "sangramento") dano += 4;
            return { ...d, turnos: d.turnos - 1 };
          })
          .filter((d) => d.turnos > 0);

        const vida = Math.max(0, prev.vidaAtual - dano);
        if (vida <= 0) setTimeout(() => morrerJogador("debuff"), 0);

        return { ...prev, vidaAtual: vida, debuffs: novosDebuffs };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  function mostrarAviso(mensagem, tipo = "sucesso") {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao({ mensagem: "", tipo: "" }), 3500);
  }

  function toggleDiaSelecao(id) {
    setDiasRepeticao((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  }

  function aplicarBencaosReliquiasPetAntesDeCombate() {
    setStatusUsuario((prev) => ({
      ...prev,
      manaAtual: Math.min(prev.manaMaxima, prev.manaAtual + (prev.pets.some((p) => p.nome === "Fênix Lunar") ? 10 : 0)),
      vidaAtual: Math.min(prev.vidaMaxima, prev.vidaAtual + (prev.reliquias.some((r) => r.nome === "Coração do Dragão") ? 6 : 0)),
    }));
  }

  function morrerJogador(origem = "combate") {
    setStatusUsuario((prev) => ({
      ...prev,
      xp: 0,
      equipamentos: [],
      debuffs: [],
      vidaMaxima: calcularHP(prev.nivel, prev.baseAtributos.vitalidade),
      vidaAtual: calcularHP(prev.nivel, prev.baseAtributos.vitalidade),
      manaMaxima: prev.baseAtributos.inteligencia * 10,
      manaAtual: prev.baseAtributos.inteligencia * 10,
      cooldowns: {},
    }));
    setInimigo(null);
    setLogsCombate([`☠️ Você morreu (${origem}). XP e equipamentos foram perdidos.`]);
    mostrarAviso("☠️ Derrota total.", "erro");
  }

  function limparDebuffs() {
    setStatusUsuario((prev) => ({ ...prev, debuffs: [] }));
  }

  function curarJogador(valor) {
    setStatusUsuario((prev) => ({ ...prev, vidaAtual: Math.min(prev.vidaMaxima, prev.vidaAtual + valor), debuffs: [] }));
  }

  function recuperarMana(valor) {
    setStatusUsuario((prev) => ({ ...prev, manaAtual: Math.min(prev.manaMaxima, prev.manaAtual + valor) }));
  }

  function addTarefa() {
    if (!input.trim()) {
      mostrarAviso("O Sistema exige um nome para a missão!", "erro");
      return;
    }

    const xpRecompensa =
      tipoMissao === "principal"
        ? 40
        : tipoMissao === "mudanca-classe"
        ? 150
        : tipoMissao === "habilidade"
        ? 80
        : 15;

    const novaTarefa = {
      id: Date.now(),
      texto: input,
      descricao,
      horario,
      tipo: tipoMissao,
      xp: xpRecompensa,
      diasAtivos: diasRepeticao,
      concluida: false,
      alarmeDisparado: false,
    };

    setLista((prev) => [...prev, novaTarefa]);
    setInput("");
    setDescricao("");
    setHorario("");
    setDiasRepeticao([]);
    mostrarAviso("Nova missão registrada no bloco de dados.", "sucesso");
  }

  function alternarConcluida(id) {
    const tarefa = lista.find((item) => item.id === id);
    if (!tarefa) return;

    setLista((prev) => prev.map((item) => (item.id === id ? { ...item, concluida: !item.concluida } : item)));

    setStatusUsuario((prev) => {
      const ganho = tarefa.concluida ? -tarefa.xp : tarefa.xp;
      let next = aplicarLevelUp(prev, ganho);

      next.ouro = Math.max(0, prev.ouro + (tarefa.tipo === "principal" ? 30 : 10) * (tarefa.concluida ? -1 : 1));
      next.vidaMaxima = calcularHP(next.nivel, next.baseAtributos.vitalidade);
      next.vidaAtual = Math.min(prev.vidaAtual, next.vidaMaxima);
      next.manaMaxima = next.baseAtributos.inteligencia * 10;
      next.manaAtual = Math.min(prev.manaAtual, next.manaMaxima);

      return next;
    });
  }

  function deletarTarefa(id) {
    setLista((prev) => prev.filter((item) => item.id !== id));
    setModalExcluir({ aberto: false, idTarefa: null });
  }

  function comprarItem(item, categoria) {
    if (statusUsuario.ouro < item.preco) {
      mostrarAviso("🪙 Ouro insuficiente.", "erro");
      return;
    }

    if (categoria === "equipamentos") {
      if (statusUsuario.equipamentos.some((eq) => eq.nome === item.nome)) {
        mostrarAviso("Você já possui este equipamento.", "erro");
        return;
      }
      setStatusUsuario((prev) => ({ ...prev, ouro: prev.ouro - item.preco, equipamentos: [...prev.equipamentos, item] }));
      mostrarAviso(`⚔️ ${item.nome} comprado com sucesso!`, "sucesso");
      return;
    }

    if (categoria === "pocoes") {
      setStatusUsuario((prev) => {
        const novosBase = {
          forca: prev.baseAtributos.forca + (item.efeito.forca || 0),
          agilidade: prev.baseAtributos.agilidade + (item.efeito.agilidade || 0),
          vitalidade: prev.baseAtributos.vitalidade + (item.efeito.vitalidade || 0),
          inteligencia: prev.baseAtributos.inteligencia + (item.efeito.inteligencia || 0),
        };

        const vidaMaxima = calcularHP(prev.nivel, novosBase.vitalidade);
        return {
          ...prev,
          ouro: prev.ouro - item.preco,
          baseAtributos: novosBase,
          vidaMaxima,
          vidaAtual: vidaMaxima,
        };
      });
      mostrarAviso(`🧪 ${item.nome} consumida.`, "sucesso");
      return;
    }

    if (categoria === "consumiveis") {
      setStatusUsuario((prev) => ({
        ...prev,
        ouro: prev.ouro - item.preco,
        vidaAtual: Math.min(prev.vidaMaxima, prev.vidaAtual + (item.cura || 0)),
        manaAtual: Math.min(prev.manaMaxima, prev.manaAtual + (item.mana || 0)),
        debuffs: item.limpaDebuffs ? [] : prev.debuffs,
      }));
      mostrarAviso(`✨ ${item.nome} usado(a).`, "sucesso");
      return;
    }

    if (categoria === "reliquias") {
      if (statusUsuario.reliquias.some((r) => r.nome === item.nome)) {
        mostrarAviso("Você já possui esta relíquia.", "erro");
        return;
      }
      setStatusUsuario((prev) => ({ ...prev, ouro: prev.ouro - item.preco, reliquias: [...prev.reliquias, item] }));
      mostrarAviso(`🧿 Relíquia obtida: ${item.nome}`, "sucesso");
      return;
    }

    if (categoria === "pets") {
      if (statusUsuario.pets.some((p) => p.nome === item.nome)) {
        mostrarAviso("Você já possui este pet.", "erro");
        return;
      }
      setStatusUsuario((prev) => ({ ...prev, ouro: prev.ouro - item.preco, pets: [...prev.pets, item] }));
      mostrarAviso(`🐾 Pet recrutado: ${item.nome}`, "sucesso");
    }
  }

  function iniciarLuta(monstro) {
    setInimigo({ ...monstro, vidaAtual: monstro.vida });
    setLogsCombate([`⚔️ Você entrou em combate contra ${monstro.nome}`]);
    aplicarBencaosReliquiasPetAntesDeCombate();
  }

  function finalizarVitoria(monstro) {
    if (!monstro) return;

    if (monstro.rank === "DIVINO") {
      const deus = DEUSES.find((d) => d.nome === monstro.nome);
      if (deus?.bencao) {
        setStatusUsuario((prev) => {
          if (prev.bencaos.some((b) => b.nome === deus.bencao.nome)) return prev;
          return {
            ...prev,
            bencaos: [...prev.bencaos, deus.bencao],
            tituloDivino: prev.tituloDivino || "Portador das Bênçãos",
          };
        });
      }
    }

    setInimigo(null);
  }

  function aplicarDebuffAoJogador(tipo, turnos = 2) {
    setStatusUsuario((prev) => {
      const existe = prev.debuffs.find((d) => d.tipo === tipo);
      const novos = existe
        ? prev.debuffs.map((d) => (d.tipo === tipo ? { ...d, turnos: Math.max(d.turnos, turnos) } : d))
        : [...prev.debuffs, { tipo, turnos }];

      return { ...prev, debuffs: novos };
    });
  }

  function getMainStat(classe, atributos) {
    if (classe === "Assassino") return atributos.agilidade;
    if (classe === "Mago" || classe === "Necromante" || classe === "Ilusionista") return atributos.inteligencia;
    if (classe === "Paladino") return atributos.vitalidade;
    if (classe === "Arqueiro") return atributos.agilidade;
    if (classe === "Monge") return atributos.vitalidade;
    if (classe === "Berserker") return atributos.forca;
    return atributos.forca;
  }

  function usarHabilidade(nome) {
    if (!inimigo) return;

    const classe = CLASS_DATA[statusUsuario.classe];
    if (!classe) return;

    const habilidade = classe.habilidades.find((h) => h.nome === nome) || statusUsuario.habilidades.find((h) => h.nome === nome);
    if (!habilidade) return;

    const cd = statusUsuario.cooldowns?.[nome] || 0;
    if (cd > 0) {
      mostrarAviso(`⏳ ${nome} ainda está em cooldown (${cd})`, "erro");
      return;
    }

    if (statusUsuario.manaAtual < habilidade.custoMana) {
      mostrarAviso("Mana insuficiente.", "erro");
      return;
    }

    const newCooldowns = { ...(statusUsuario.cooldowns || {}), [nome]: habilidade.cooldown };
    const logs = [...logsCombate];

    if (habilidade.tipo === "cura") {
      const cura = Math.floor(atributosAtuais.vitalidade * habilidade.healPower);
      setStatusUsuario((prev) => ({
        ...prev,
        manaAtual: prev.manaAtual - habilidade.custoMana,
        vidaAtual: Math.min(prev.vidaMaxima, prev.vidaAtual + cura),
        debuffs: [],
        cooldowns: newCooldowns,
      }));
      logs.push(`💚 ${nome} curou ${cura} HP.`);
      setLogsCombate(logs);
      return;
    }

    if (habilidade.tipo === "buff") {
      setStatusUsuario((prev) => ({
        ...prev,
        manaAtual: prev.manaAtual - habilidade.custoMana,
        debuffs: prev.debuffs.filter((d) => d.tipo !== "sono"),
        cooldowns: newCooldowns,
      }));
      logs.push(`🛡️ ${nome} ativado.`);
      setLogsCombate(logs);
      return;
    }

    if (habilidade.tipo === "debuff") {
      aplicarDebuffAoJogador("cegueira", 2);
      setStatusUsuario((prev) => ({
        ...prev,
        manaAtual: prev.manaAtual - habilidade.custoMana,
        cooldowns: newCooldowns,
      }));
      logs.push(`🌑 ${nome} confundiu o inimigo.`);
      setLogsCombate(logs);
      return;
    }

    if (habilidade.tipo === "invocacao") {
      setStatusUsuario((prev) => ({
        ...prev,
        manaAtual: prev.manaAtual - habilidade.custoMana,
        sombras: [...prev.sombras, { nome: `Sombra de ${inimigo.nome}`, poder: Math.floor(inimigo.ataque * 0.4) }],
        cooldowns: newCooldowns,
      }));
      logs.push(`🌘 ${nome} arrancou uma sombra do alvo.`);
      setLogsCombate(logs);
      return;
    }

    let base = getMainStat(statusUsuario.classe, atributosAtuais);
    let dano = Math.floor(base * (habilidade.power || 1));

    if (statusUsuario.bencaos.some((b) => b.nome === "Chamas Eternas")) dano += 120;
    if (statusUsuario.pets.some((p) => p.nome === "Dragão Jovem")) dano += 18;

    const crit = Math.random() * 100 < atributosAtuais.critico + (habilidade.critBonus || 0);
    if (crit) dano = Math.floor(dano * 1.8);

    setInimigo((prev) => ({ ...prev, vidaAtual: Math.max(0, prev.vidaAtual - dano) }));
    setStatusUsuario((prev) => ({
      ...prev,
      manaAtual: prev.manaAtual - habilidade.custoMana,
      cooldowns: newCooldowns,
      vidaAtual: habilidade.rouboVida ? Math.min(prev.vidaMaxima, prev.vidaAtual + Math.floor(dano * habilidade.rouboVida)) : prev.vidaAtual,
    }));

    logs.push(`✨ ${nome} causou ${dano} de dano${crit ? " (CRÍTICO)" : ""}.`);
    setLogsCombate(logs);
  }

  function executarTurnoAtaque() {
    if (!inimigo) return;
    if (statusUsuario.vidaAtual <= 0) return;

    const rankPlayer = statusUsuario.rank;
    const rankMonstro = inimigo.rank;
    const logs = [...logsCombate];

    if (statusUsuario.debuffs.some((d) => d.tipo === "sono")) {
      logs.push("😴 Você perdeu o turno por causa do sono.");
      setStatusUsuario((prev) => ({ ...prev, debuffs: prev.debuffs.filter((d) => d.tipo !== "sono") }));
      setLogsCombate(logs);
      return;
    }

    const esquiva = atributosAtuais.esquiva + (statusUsuario.bencaos.some((b) => b.nome === "Olhos do Vazio") ? 30 : 0);
    const desvio = Math.random() * 100 < esquiva;

    let base = getMainStat(statusUsuario.classe, atributosAtuais);
    let danoPlayer = Math.floor(base * 0.8);

    if (statusUsuario.habilidades.some((h) => (typeof h === "string" ? h : h.nome).includes("Território do Monarca"))) danoPlayer *= 3;
    if (statusUsuario.habilidades.some((h) => (typeof h === "string" ? h : h.nome).includes("Sede de Sangue"))) danoPlayer += 10;
    if (statusUsuario.bencaos.some((b) => b.nome === "Chamas Eternas")) danoPlayer += 120;
    if (statusUsuario.debuffs.some((d) => d.tipo === "cegueira")) danoPlayer = Math.max(1, Math.floor(danoPlayer * 0.6));
    if (desvio) danoPlayer = 0;

    danoPlayer = Math.floor(danoPlayer * multiplicadorDano(rankPlayer, rankMonstro));

    const vidaMonstro = Math.max(0, inimigo.vidaAtual - danoPlayer);
    logs.push(`⚔️ Você causou ${danoPlayer} de dano.`);

    if (vidaMonstro <= 0) {
      logs.push(`🏆 ${inimigo.nome} foi derrotado.`);

      const xpBonus = statusUsuario.reliquias.some((r) => r.nome === "Coroa do Monarca") ? 1.15 : 1;
      setStatusUsuario((prev) => ({
        ...prev,
        ouro: prev.ouro + inimigo.recompensa,
      }));

      setLogsCombate(logs);
      setTimeout(() => {
        setStatusUsuario((prev) => aplicarLevelUp(prev, Math.floor(80 * xpBonus)));
        finalizarVitoria(inimigo);
      }, 80);
      return;
    }

    const multi = multiplicadorDano(rankPlayer, rankMonstro);
    let danoMonstro = Math.max(1, Math.floor(inimigo.ataque * multi - atributosAtuais.vitalidade * 0.15));
    if (desvio) danoMonstro = 0;
    if (statusUsuario.bencaos.some((b) => b.nome === "Olhos do Vazio") && Math.random() < 0.3) danoMonstro = 0;

    if (inimigo.debuff === "veneno" && Math.random() < 0.25) aplicarDebuffAoJogador("veneno", 3);
    if (inimigo.debuff === "chamas" && Math.random() < 0.3) aplicarDebuffAoJogador("chamas", 3);
    if (inimigo.debuff === "cegueira" && Math.random() < 0.22) aplicarDebuffAoJogador("cegueira", 2);
    if (inimigo.debuff === "sono" && Math.random() < 0.2) aplicarDebuffAoJogador("sono", 1);
    if (inimigo.debuff === "sangramento" && Math.random() < 0.25) aplicarDebuffAoJogador("sangramento", 3);

    logs.push(`💥 ${inimigo.nome} causou ${danoMonstro} de dano.`);

    const vida = Math.max(0, statusUsuario.vidaAtual - danoMonstro);
    setStatusUsuario((prev) => ({
      ...prev,
      vidaAtual: vida,
      manaAtual: Math.max(0, prev.manaAtual - 1),
      cooldowns: Object.fromEntries(Object.entries(prev.cooldowns || {}).map(([k, v]) => [k, Math.max(0, v - 1)])),
    }));

    if (vida <= 0) {
      setLogsCombate(logs);
      setTimeout(() => morrerJogador("combate"), 100);
      return;
    }

    setInimigo((prev) => ({ ...prev, vidaAtual: vidaMonstro }));
    setLogsCombate(logs);
  }

  const diasDaSemana = [
    { id: 0, nome: "Dom" },
    { id: 1, nome: "Seg" },
    { id: 2, nome: "Ter" },
    { id: 3, nome: "Qua" },
    { id: 4, nome: "Qui" },
    { id: 5, nome: "Sex" },
    { id: 6, nome: "Sáb" },
  ];

  const classeAtual = CLASS_DATA[statusUsuario.classe] || CLASS_DATA["Sem Classe"];

  function renderHabilidadesClasse() {
    if (!classeAtual?.habilidades?.length) return <p className="vazio">Nenhuma</p>;

    return classeAtual.habilidades.map((hab, i) => {
      const cd = statusUsuario.cooldowns?.[hab.nome] || 0;
      return (
        <button
          key={i}
          className="btn-habilidade"
          disabled={!inimigo || cd > 0 || statusUsuario.manaAtual < hab.custoMana}
          onClick={() => usarHabilidade(hab.nome)}
        >
          {hab.nome} {cd > 0 ? `(CD ${cd})` : `(${hab.custoMana} MP)`}
        </button>
      );
    });
  }

  return (
    <div className="container-rpg">
      {notificacao.mensagem && <div className={`alerta ${notificacao.tipo}`}>{notificacao.mensagem}</div>}

      {modalExcluir.aberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Deseja remover essa missão do sistema?</h3>
            <div className="modal-actions">
              <button onClick={() => deletarTarefa(modalExcluir.idTarefa)} className="btn-erro">
                Confirmar
              </button>
              <button onClick={() => setModalExcluir({ aberto: false, idTarefa: null })} className="btn-secundario">
                Abortar
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="painel-status">
        <div className="header-status">
          <h2>STATUS DO CAÇADOR</h2>
          <button className="btn-tema" onClick={() => setModo(!modo)}>
            {modo ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="status-info">
          <p><strong>Nível:</strong> {statusUsuario.nivel}</p>
          <p>
            <strong>Rank:</strong> <span className={`rank-jogador ${statusUsuario.rank}`}>{statusUsuario.rank}</span>
          </p>
          <p>
            <strong>Classe:</strong> <span className="classe-tag">{statusUsuario.classe}</span>
          </p>
          <p><strong>XP:</strong> {statusUsuario.xp} / {statusUsuario.xpNecessario}</p>
          <div className="barra-container">
            <div className="barra-interna xp" style={{ width: `${Math.min(100, (statusUsuario.xp / statusUsuario.xpNecessario) * 100)}%` }} />
          </div>

          <p><strong>HP:</strong> {statusUsuario.vidaAtual} / {statusUsuario.vidaMaxima}</p>
          <div className="barra-container">
            <div className="barra-interna hp" style={{ width: `${Math.min(100, (statusUsuario.vidaAtual / statusUsuario.vidaMaxima) * 100)}%` }} />
          </div>

          <p><strong>MP:</strong> {statusUsuario.manaAtual} / {statusUsuario.manaMaxima}</p>
          <div className="barra-container">
            <div className="barra-interna mp" style={{ width: `${Math.min(100, (statusUsuario.manaAtual / statusUsuario.manaMaxima) * 100)}%` }} />
          </div>

          <p className="ouro-contador">🪙 {statusUsuario.ouro}</p>
          <p><strong>Crítico:</strong> {atributosAtuais.critico}%</p>
          <p><strong>Esquiva:</strong> {atributosAtuais.esquiva}%</p>
        </div>

        <div className="atributos-grid">
          <div><span>Força</span><span>{atributosAtuais.forca}</span></div>
          <div><span>Agilidade</span><span>{atributosAtuais.agilidade}</span></div>
          <div><span>Vitalidade</span><span>{atributosAtuais.vitalidade}</span></div>
          <div><span>Inteligência</span><span>{atributosAtuais.inteligencia}</span></div>
        </div>

        <div className="seccao-lista">
          <h4>Habilidades de Classe</h4>
          <div className="grid-botoes">{renderHabilidadesClasse()}</div>
        </div>

        <div className="seccao-lista">
          <h4>Equipamentos</h4>
          {statusUsuario.equipamentos.length === 0 ? (
            <p className="vazio">Nenhum</p>
          ) : (
            statusUsuario.equipamentos.map((eq, i) => (
              <span key={i} className="badge">
                🛡️ {eq.nome}
              </span>
            ))
          )}
        </div>

        <div className="seccao-lista">
          <h4>Pets</h4>
          {statusUsuario.pets.length === 0 ? (
            <p className="vazio">Nenhum</p>
          ) : (
            statusUsuario.pets.map((p, i) => (
              <span key={i} className="badge">
                🐾 {p.nome}
              </span>
            ))
          )}
        </div>

        <div className="seccao-lista">
          <h4>Sombras</h4>
          {statusUsuario.sombras.length === 0 ? (
            <p className="vazio">Nenhuma</p>
          ) : (
            statusUsuario.sombras.map((s, i) => (
              <span key={i} className="badge">
                🌘 {s.nome}
              </span>
            ))
          )}
        </div>

        <div className="seccao-lista">
          <h4>Bênçãos</h4>
          {statusUsuario.bencaos.length === 0 ? (
            <p className="vazio">Nenhuma</p>
          ) : (
            statusUsuario.bencaos.map((b, i) => (
              <span key={i} className="badge">
                ✨ {b.nome}
              </span>
            ))
          )}
        </div>

        <div className="seccao-lista">
          <h4>Debuffs</h4>
          {statusUsuario.debuffs.length === 0 ? (
            <p className="vazio">Nenhum</p>
          ) : (
            statusUsuario.debuffs.map((d, i) => (
              <span key={i} className={`badge debuff ${d.tipo}`}>
                {d.tipo} ({d.turnos})
              </span>
            ))
          )}
        </div>
      </aside>

      <main className="painel-central">
        <nav className="abas-navegacao">
          <button className={abaAtiva === "missoes" ? "ativa" : ""} onClick={() => setAbaAtiva("missoes")}>
            📜 Missões
          </button>
          <button className={abaAtiva === "dungeons" ? "ativa" : ""} onClick={() => setAbaAtiva("dungeons")}>
            🌌 Dungeons
          </button>
          <button className={abaAtiva === "loja" ? "ativa" : ""} onClick={() => setAbaAtiva("loja")}>
            🛒 Loja
          </button>
        </nav>

        {abaAtiva === "missoes" && (
          <div className="quadro">
            <h2>SISTEMA DE MISSÕES</h2>

            <div className="form-missao">
              <input type="text" placeholder="Nome da Missão..." value={input} onChange={(e) => setInput(e.target.value)} />
              <textarea placeholder="Descrição detalhada dos objetivos..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />

              <div className="opcoes-linha">
                <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
                <select value={tipoMissao} onChange={(e) => setTipoMissao(e.target.value)}>
                  <option value="secundaria">Missão Secundária (15 XP)</option>
                  <option value="principal">Missão Principal (40 XP)</option>
                  {statusUsuario.nivel >= 10 && statusUsuario.classe === "Sem Classe" && <option value="mudanca-classe">🔥 Troca de Classe</option>}
                  {statusUsuario.nivel >= 15 && statusUsuario.classe !== "Sem Classe" && <option value="habilidade">🔮 Desbloqueio de Habilidade</option>}
                </select>
              </div>

              <div className="dias-seletor">
                <p>Ativa em quais dias? (Vazio = Todos)</p>
                <div className="dias-botoes">
                  {diasDaSemana.map((d) => (
                    <button key={d.id} type="button" className={diasRepeticao.includes(d.id) ? "ativo" : ""} onClick={() => toggleDiaSelecao(d.id)}>
                      {d.nome}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-add-missao" onClick={addTarefa}>
                Vincular Missão
              </button>
            </div>

            <div className="lista-missoes">
              {lista.length === 0 ? (
                <div className="estado-vazio">
                  <p>Nenhuma missão registrada ainda.</p>
                </div>
              ) : (
                lista.map((item) => (
                  <div key={item.id} className={`card-missao ${item.tipo} ${item.concluida ? "concluida" : ""}`}>
                    <div className="card-corpo">
                      <h3>
                        {item.texto} <span className="xp-badge">+{item.xp} XP</span>
                      </h3>
                      <p className="desc">{item.descricao || "Sem descrição."}</p>
                      {item.horario && (
                        <div className="metadados">
                          <span>⏰ {item.horario}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-acoes">
                      <button onClick={() => alternarConcluida(item.id)} className="btn-concluir">
                        {item.concluida ? "Desmarcar" : "Cumprir"}
                      </button>
                      <button onClick={() => setModalExcluir({ aberto: true, idTarefa: item.id })} className="btn-excluir">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {abaAtiva === "dungeons" && (
          <div className="quadro">
            <h2>PORTAL DE DUNGEONS</h2>

            {!inimigo ? (
              <>
                <div className="selecao-monstros">
                  {MONSTROS.map((m, idx) => (
                    <div key={idx} className={`card-monstro rank-${m.rank}`}>
                      <div>
                        <strong>[{m.rank}] {m.nome}</strong>
                        <p>HP: {m.vida} | ATK: {m.ataque}</p>
                      </div>
                      <button onClick={() => iniciarLuta(m)} className="btn-lutar">
                        Entrar
                      </button>
                    </div>
                  ))}
                </div>

                {statusUsuario.rank === "NATIONAL" && (
                  <>
                    <h2>PANTEÃO DIVINO</h2>
                    <div className="selecao-monstros">
                      {DEUSES.map((d, idx) => (
                        <div key={idx} className="card-monstro boss-divino">
                          <div>
                            <strong>[{d.rank}] {d.nome}</strong>
                            <p>HP: {d.vida} | ATK: {d.ataque}</p>
                            <p>{d.bencao.descricao}</p>
                          </div>
                          <button onClick={() => iniciarLuta(d)} className="btn-lutar">
                            Desafiar Deus
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="combate-ativo">
                <h3>Batalha Ativa!</h3>
                <p className="nome-monstro">
                  [{inimigo.rank}] {inimigo.nome}
                </p>

                <div className="barra-container">
                  <div className="barra-interna hp" style={{ width: `${Math.min(100, (inimigo.vidaAtual / inimigo.vida) * 100)}%` }} />
                </div>

                <p>
                  {inimigo.vidaAtual} / {inimigo.vida} HP
                </p>

                <div className="logs-caixa">
                  {logsCombate.map((log, i) => (
                    <p key={i}>{log}</p>
                  ))}
                </div>

                <div className="botoes-combate">
                  <button onClick={executarTurnoAtaque} className="btn-atacar">
                    Atacar
                  </button>
                  <button onClick={() => setInimigo(null)} className="btn-fugir">
                    Fugir
                  </button>
                </div>

                <div className="grid-botoes">{renderHabilidadesClasse()}</div>

                <div className="quick-actions">
                  <button className="btn-secundario" onClick={() => curarJogador(100)}>
                    Cura Rápida
                  </button>
                  <button className="btn-secundario" onClick={() => recuperarMana(100)}>
                    Mana Rápida
                  </button>
                  <button className="btn-secundario" onClick={limparDebuffs}>
                    Limpar Debuffs
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {abaAtiva === "loja" && (
          <div className="quadro">
            <h2>LOJA INTERATIVA DO JOGO</h2>

            <h3>Equipamentos</h3>
            <div className="grid-loja-itens">
              {LOJA.equipamentos.map((eq) => (
                <div key={eq.id} className="card-item-loja">
                  <h4>{eq.nome}</h4>
                  <p>{eq.desc}</p>
                  <button onClick={() => comprarItem(eq, "equipamentos")}>🪙 {eq.preco} Ouro</button>
                </div>
              ))}
            </div>

            <h3>Poções de Status</h3>
            <div className="grid-loja-itens">
              {LOJA.pocoes.map((po) => (
                <div key={po.id} className="card-item-loja">
                  <h4>{po.nome}</h4>
                  <p>{po.desc}</p>
                  <button onClick={() => comprarItem(po, "pocoes")}>🪙 {po.preco} Ouro</button>
                </div>
              ))}
            </div>

            <h3>Consumíveis de Combate</h3>
            <div className="grid-loja-itens">
              {LOJA.consumiveis.map((co) => (
                <div key={co.id} className="card-item-loja">
                  <h4>{co.nome}</h4>
                  <p>{co.desc}</p>
                  <button onClick={() => comprarItem(co, "consumiveis")}>🪙 {co.preco} Ouro</button>
                </div>
              ))}
            </div>

            <h3>Relíquias</h3>
            <div className="grid-loja-itens">
              {LOJA.reliquias.map((re) => (
                <div key={re.id} className="card-item-loja">
                  <h4>{re.nome}</h4>
                  <p>{re.desc}</p>
                  <button onClick={() => comprarItem(re, "reliquias")}>🪙 {re.preco} Ouro</button>
                </div>
              ))}
            </div>

            <h3>Pets</h3>
            <div className="grid-loja-itens">
              {LOJA.pets.map((pt) => (
                <div key={pt.id} className="card-item-loja">
                  <h4>{pt.nome}</h4>
                  <p>{pt.desc}</p>
                  <button onClick={() => comprarItem(pt, "pets")}>🪙 {pt.preco} Ouro</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <aside className="painel-status painel-direito">
        <h2>CONTROLES RÁPIDOS</h2>
        <button className="btn-secundario" onClick={() => curarJogador(100)}>
          +100 HP
        </button>
        <button className="btn-secundario" onClick={() => recuperarMana(100)}>
          +100 MP
        </button>
        <button className="btn-secundario" onClick={limparDebuffs}>
          Purificar Debuffs
        </button>
        <button className="btn-secundario" onClick={() => setStatusUsuario((prev) => ({ ...prev, inventario: [...prev.inventario, { nome: "Kit de Cura" }] }))}>
          Adicionar Inventário
        </button>

        <h3>Classes Possíveis</h3>
        <div className="seccao-lista">
          {Object.keys(CLASS_DATA).map((c, i) => (
            <span key={i} className="badge">
              {c}
            </span>
          ))}
        </div>

        <h3>Títulos</h3>
        <div className="seccao-lista">
          {statusUsuario.titulos.length === 0 ? (
            <p className="vazio">Nenhum</p>
          ) : (
            statusUsuario.titulos.map((t, i) => (
              <span key={i} className="badge">
                👑 {t}
              </span>
            ))
          )}
        </div>

        <h3>Inventário</h3>
        <div className="seccao-lista">
          {statusUsuario.inventario.length === 0 ? (
            <p className="vazio">Vazio</p>
          ) : (
            statusUsuario.inventario.map((it, i) => (
              <span key={i} className="badge">
                📦 {it.nome}
              </span>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

export default App;