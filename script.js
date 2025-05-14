document.addEventListener("DOMContentLoaded", () => {
  // Preencher opções de horário em todos os selects
  const horariosSelects = document.querySelectorAll('select[id$="-horario"]');
  horariosSelects.forEach((select) => {
    fillTimeOptions(select);
  });

  // Configurar navegação entre blocos
  setupNavigation();

  // Configurar validação de WhatsApp
  setupWhatsAppValidation();

  // Configurar exibição do nome do pet
  setupPetNameDisplay();

  // Configurar lógica condicional para blocos
  setupConditionalBlocks();

  // Configurar adição de remédios
  setupRemediosAddition();

  // Configurar campos dinâmicos para refeições, água, glicemia e insulina
  setupDynamicFields();

  // Configurar campo "outro" para duração de remédios
  setupOutroDuracao();

  // Configurar botão de compartilhar via WhatsApp
  setupShareWhatsApp();

  // Configurar envio do formulário
  setupFormSubmission();

  // Configurar validação de datas (2025+)
  setupDateValidation();

  // Configurar botões dinâmicos (Próximo/Finalizar)
  setupDynamicButtons();
});

// Função para preencher opções de horário (de 30 em 30 minutos)
function fillTimeOptions(select) {
  if (!select) return;

  // Limpar opções existentes
  select.innerHTML = "";

  // Adicionar opção vazia
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Selecione um horário";
  select.appendChild(emptyOption);

  for (let hour = 0; hour < 24; hour++) {
    for (const minute of ["00", "30"]) {
      const timeValue = `${hour.toString().padStart(2, "0")}:${minute}`;
      const option = document.createElement("option");
      option.value = timeValue;
      option.textContent = timeValue;
      select.appendChild(option);
    }
  }
}

// Função para configurar campos dinâmicos para refeições, água, glicemia e insulina
function setupDynamicFields() {
  // Configurar refeições
  setupQuantityField(
    "refeicoes-quantidade",
    "refeicoes-container",
    "refeicao",
    "refeição"
  );

  // Configurar água
  setupQuantityField("agua-quantidade", "agua-container", "agua", "reposição");

  // Configurar glicemia
  setupQuantityField(
    "glicemia-quantidade",
    "glicemia-container",
    "glicemia",
    "medição"
  );

  // Configurar insulina
  setupQuantityField(
    "insulina-quantidade",
    "insulina-container",
    "insulina",
    "aplicação"
  );
}

// Função genérica para configurar campos baseados em quantidade
function setupQuantityField(quantityInputId, containerId, prefix, label) {
  const quantityInput = document.getElementById(quantityInputId);
  const container = document.getElementById(containerId);

  if (!quantityInput || !container) return;

  // Limpar o container inicialmente
  container.innerHTML = "";

  // Adicionar evento de mudança
  quantityInput.addEventListener("input", function () {
    const quantity = parseInt(this.value) || 0;

    // Limitar a quantidade máxima a 5
    if (quantity > 5) {
      this.value = "5";
      return;
    }

    // Limpar o container
    container.innerHTML = "";

    // Adicionar campos baseados na quantidade
    for (let i = 1; i <= quantity; i++) {
      const itemDiv = document.createElement("div");
      itemDiv.className = `${prefix}-item`;
      itemDiv.id = `${prefix}-${i}`;

      itemDiv.innerHTML = `
          <div class="form-group">
            <label for="${prefix}-${i}-horario">Horário da ${i}ª ${label}</label>
            <select id="${prefix}-${i}-horario" name="${prefix}-${i}-horario" required>
              <!-- Opções de horário serão preenchidas via JavaScript -->
            </select>
          </div>
        `;

      container.appendChild(itemDiv);

      // Preencher opções de horário
      fillTimeOptions(document.getElementById(`${prefix}-${i}-horario`));
    }
  });

  // Inicializar com valor 1 para mostrar pelo menos um campo
  quantityInput.value = "1";
  quantityInput.dispatchEvent(new Event("input"));
}

// Configurar botões dinâmicos (Próximo/Finalizar)
function setupDynamicButtons() {
  // Verificar quais lembretes foram selecionados
  document.querySelectorAll('input[name="lembretes"]').forEach((checkbox) => {
    checkbox.addEventListener("change", updateButtonLabels);
  });

  // Verificar quais vacinas foram selecionadas
  document.querySelectorAll('input[name="vacinas"]').forEach((checkbox) => {
    checkbox.addEventListener("change", updateButtonLabels);
  });

  // Atualizar inicialmente
  updateButtonLabels();
}

// Função para atualizar os rótulos dos botões com base nas seleções
function updateButtonLabels() {
  const blocks = document.querySelectorAll(".form-block");

  // Determinar quais lembretes foram selecionados
  const selectedLembretes = Array.from(
    document.querySelectorAll('input[name="lembretes"]:checked')
  ).map((cb) => cb.value);

  // Determinar quais vacinas foram selecionadas
  const selectedVacinas = Array.from(
    document.querySelectorAll('input[name="vacinas"]:checked')
  ).map((cb) => cb.value);

  // Determinar o último bloco baseado nas seleções
  let lastBlockId = null;

  if (selectedLembretes.includes("documentacao")) {
    lastBlockId = "block-16";
  } else if (selectedLembretes.includes("consulta")) {
    lastBlockId = "block-consulta";
  } else if (selectedLembretes.includes("insulina")) {
    lastBlockId = "block-14";
  } else if (selectedLembretes.includes("glicemia")) {
    lastBlockId = "block-13";
  } else if (selectedLembretes.includes("agua")) {
    lastBlockId = "block-12";
  } else if (selectedLembretes.includes("comida")) {
    lastBlockId = "block-11";
  } else if (selectedLembretes.includes("remedios")) {
    lastBlockId = "block-10";
  } else if (selectedLembretes.includes("vacinas")) {
    if (selectedVacinas.includes("giardia")) {
      lastBlockId = "block-9";
    } else if (selectedVacinas.includes("gripe")) {
      lastBlockId = "block-8";
    } else if (selectedVacinas.includes("antirrabica")) {
      lastBlockId = "block-7";
    } else if (selectedVacinas.includes("polivalente")) {
      lastBlockId = "block-6";
    } else {
      lastBlockId = "block-5";
    }
  } else {
    lastBlockId = "block-4"; // Se nenhum lembrete selecionado
  }

  // Atualizar os botões em todos os blocos
  blocks.forEach((block) => {
    const nextBtn = block.querySelector(".next-btn");
    if (nextBtn && block.id === lastBlockId) {
      nextBtn.textContent = "Finalizar";
      nextBtn.classList.add("finalizar-btn");
    } else if (nextBtn) {
      nextBtn.textContent = "Próximo";
      nextBtn.classList.remove("finalizar-btn");
    }
  });
}

// Configurar navegação entre blocos
function setupNavigation() {
  const blocks = document.querySelectorAll(".form-block");
  const progress = document.getElementById("progress");

  // Armazenar o histórico de navegação para facilitar o botão "voltar"
  const navigationHistory = [];

  // Esconder todos os blocos exceto o primeiro
  blocks.forEach((block, index) => {
    if (index !== 0) {
      block.style.display = "none";
    } else {
      block.style.display = "block";
      block.classList.add("active");
      navigationHistory.push(block.id);
    }
  });

  // Configurar botões de próximo
  document.querySelectorAll(".next-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const currentBlock = this.closest(".form-block");

      // Validar campos obrigatórios antes de avançar
      if (!validateRequiredFields(currentBlock)) {
        return; // Não avança se a validação falhar
      }

      // Validar seleções específicas para cada tipo de bloco
      if (currentBlock.id === "block-5" && !validateVacinasSelection()) {
        return; // Não avança se nenhuma vacina foi selecionada
      }

      // Verificar se é o botão "Finalizar"
      if (this.classList.contains("finalizar-btn")) {
        // Ir diretamente para o bloco final
        const finalBlock = document.getElementById("block-final");

        // Esconder o bloco atual
        currentBlock.style.display = "none";
        currentBlock.classList.remove("active");

        // Mostrar o bloco final
        finalBlock.style.display = "block";
        finalBlock.classList.add("active");

        // Mostrar o container de compartilhamento
        const shareContainer = finalBlock.querySelector(".share-container");
        if (shareContainer) {
          shareContainer.style.display = "block";
        }

        // Enviar os dados do formulário
        submitFormData();

        // Atualizar a barra de progresso
        progress.style.width = "100%";

        // Rolar para o topo
        window.scrollTo(0, 0);

        return;
      }

      // Determinar o próximo bloco com base no bloco atual e nas seleções
      const nextBlock = determineNextBlock(currentBlock);

      if (nextBlock) {
        // Esconder o bloco atual
        currentBlock.style.display = "none";
        currentBlock.classList.remove("active");

        // Mostrar o próximo bloco
        nextBlock.style.display = "block";
        nextBlock.classList.add("active");

        // Adicionar ao histórico de navegação
        navigationHistory.push(nextBlock.id);

        // Limitar o histórico para evitar crescimento excessivo
        if (navigationHistory.length > 20) {
          navigationHistory.shift();
        }

        // Atualizar a barra de progresso
        updateProgressBar();

        // Rolar para o topo
        window.scrollTo(0, 0);
      } else {
        console.error("Próximo bloco não encontrado");
      }
    });
  });

  // Configurar botões de voltar
  document.querySelectorAll(".back-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const currentBlock = this.closest(".form-block");

      // Não permitir voltar no bloco final
      if (currentBlock.id === "block-final") {
        return;
      }

      // Remover o bloco atual do histórico
      if (
        navigationHistory.length > 0 &&
        navigationHistory[navigationHistory.length - 1] === currentBlock.id
      ) {
        navigationHistory.pop();
      }

      // Obter o ID do bloco anterior do histórico
      const prevBlockId =
        navigationHistory.length > 0
          ? navigationHistory[navigationHistory.length - 1]
          : null;
      const prevBlock = prevBlockId
        ? document.getElementById(prevBlockId)
        : null;

      if (prevBlock) {
        // Esconder o bloco atual
        currentBlock.style.display = "none";
        currentBlock.classList.remove("active");

        // Mostrar o bloco anterior
        prevBlock.style.display = "block";
        prevBlock.classList.add("active");

        // Atualizar a barra de progresso
        updateProgressBar();

        // Rolar para o topo
        window.scrollTo(0, 0);
      } else {
        console.error("Bloco anterior não encontrado");
      }
    });
  });

  // Função para validar seleção de vacinas
  function validateVacinasSelection() {
    // Se estamos no bloco de vacinas, pelo menos uma vacina deve ser selecionada
    const vacinasChecked =
      document.querySelectorAll('input[name="vacinas"]:checked').length > 0;

    if (!vacinasChecked) {
      // Mostrar mensagem de erro
      let errorMsg = document.getElementById("vacinas-error");
      if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.id = "vacinas-error";
        errorMsg.className = "error-message";
        errorMsg.textContent = "Por favor, selecione pelo menos uma vacina";
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "14px";
        errorMsg.style.marginTop = "10px";
        errorMsg.style.textAlign = "center";

        const vacinasNext = document.getElementById("vacinas-next");
        if (vacinasNext) {
          vacinasNext.parentNode.insertBefore(errorMsg, vacinasNext);
        }
      } else {
        errorMsg.style.display = "block";
      }
      return false;
    } else {
      // Ocultar mensagem de erro se existir
      const errorMsg = document.getElementById("vacinas-error");
      if (errorMsg) {
        errorMsg.style.display = "none";
      }
      return true;
    }
  }

  // Função para determinar o próximo bloco com base no bloco atual e nas seleções
  function determineNextBlock(currentBlock) {
    const currentId = currentBlock.id;

    // Mapeamento de blocos específicos
    if (currentId === "block-1") {
      return document.getElementById("block-2");
    } else if (currentId === "block-2") {
      return document.getElementById("block-3");
    } else if (currentId === "block-3") {
      return document.getElementById("block-4");
    } else if (currentId === "block-4") {
      // Lógica para o bloco de lembretes
      if (document.getElementById("lembrete-vacinas").checked) {
        return document.getElementById("block-5"); // Bloco de vacinas
      } else if (document.getElementById("lembrete-remedios").checked) {
        return document.getElementById("block-10"); // Bloco de remédios
      } else if (document.getElementById("lembrete-comida").checked) {
        return document.getElementById("block-11"); // Bloco de comida
      } else if (document.getElementById("lembrete-agua").checked) {
        return document.getElementById("block-12"); // Bloco de água
      } else if (document.getElementById("lembrete-glicemia").checked) {
        return document.getElementById("block-13"); // Bloco de glicemia
      } else if (document.getElementById("lembrete-insulina").checked) {
        return document.getElementById("block-14"); // Bloco de insulina
      } else if (document.getElementById("lembrete-consulta").checked) {
        return document.getElementById("block-consulta"); // Bloco de próxima consulta
      } else if (document.getElementById("lembrete-documentacao").checked) {
        return document.getElementById("block-16"); // Bloco de documentação
      } else {
        return document.getElementById("block-final"); // Bloco final como fallback
      }
    } else if (currentId === "block-5") {
      // Lógica para o bloco de vacinas
      if (document.getElementById("vacina-polivalente").checked) {
        return document.getElementById("block-6"); // Bloco de vacina polivalente
      } else if (document.getElementById("vacina-antirrabica").checked) {
        return document.getElementById("block-7"); // Bloco de vacina antirrábica
      } else if (document.getElementById("vacina-gripe").checked) {
        return document.getElementById("block-8"); // Bloco de vacina gripe
      } else if (document.getElementById("vacina-giardia").checked) {
        return document.getElementById("block-9"); // Bloco de vacina giárdia
      } else {
        // Se nenhuma vacina foi selecionada, verificar outros lembretes
        if (document.getElementById("lembrete-remedios").checked) {
          return document.getElementById("block-10"); // Bloco de remédios
        } else if (document.getElementById("lembrete-comida").checked) {
          return document.getElementById("block-11"); // Bloco de comida
        } else if (document.getElementById("lembrete-agua").checked) {
          return document.getElementById("block-12"); // Bloco de água
        } else if (document.getElementById("lembrete-glicemia").checked) {
          return document.getElementById("block-13"); // Bloco de glicemia
        } else if (document.getElementById("lembrete-insulina").checked) {
          return document.getElementById("block-14"); // Bloco de insulina
        } else if (document.getElementById("lembrete-consulta").checked) {
          return document.getElementById("block-consulta"); // Bloco de próxima consulta
        } else if (document.getElementById("lembrete-documentacao").checked) {
          return document.getElementById("block-16"); // Bloco de documentação
        } else {
          return document.getElementById("block-final"); // Bloco final
        }
      }
    } else if (
      currentId === "block-6" ||
      currentId === "block-7" ||
      currentId === "block-8" ||
      currentId === "block-9"
    ) {
      // Após os blocos de vacinas específicas, verificar se há mais vacinas selecionadas
      const vacinaPolivalente = document.getElementById("vacina-polivalente");
      const vacinaAntirrabica = document.getElementById("vacina-antirrabica");
      const vacinaGripe = document.getElementById("vacina-gripe");
      const vacinaGiardia = document.getElementById("vacina-giardia");

      if (currentId === "block-6" && vacinaAntirrabica.checked) {
        return document.getElementById("block-7");
      } else if (
        (currentId === "block-6" || currentId === "block-7") &&
        vacinaGripe.checked
      ) {
        return document.getElementById("block-8");
      } else if (
        (currentId === "block-6" ||
          currentId === "block-7" ||
          currentId === "block-8") &&
        vacinaGiardia.checked
      ) {
        return document.getElementById("block-9");
      } else {
        // Se não há mais vacinas, verificar outros lembretes
        if (document.getElementById("lembrete-remedios").checked) {
          return document.getElementById("block-10"); // Bloco de remédios
        } else if (document.getElementById("lembrete-comida").checked) {
          return document.getElementById("block-11"); // Bloco de comida
        } else if (document.getElementById("lembrete-agua").checked) {
          return document.getElementById("block-12"); // Bloco de água
        } else if (document.getElementById("lembrete-glicemia").checked) {
          return document.getElementById("block-13"); // Bloco de glicemia
        } else if (document.getElementById("lembrete-insulina").checked) {
          return document.getElementById("block-14"); // Bloco de insulina
        } else if (document.getElementById("lembrete-consulta").checked) {
          return document.getElementById("block-consulta"); // Bloco de próxima consulta
        } else if (document.getElementById("lembrete-documentacao").checked) {
          return document.getElementById("block-16"); // Bloco de documentação
        } else {
          return document.getElementById("block-final"); // Bloco final como fallback
        }
      }
    } else if (currentId === "block-10") {
      // Após o bloco de remédios
      if (document.getElementById("lembrete-comida").checked) {
        return document.getElementById("block-11"); // Bloco de comida
      } else if (document.getElementById("lembrete-agua").checked) {
        return document.getElementById("block-12"); // Bloco de água
      } else if (document.getElementById("lembrete-glicemia").checked) {
        return document.getElementById("block-13"); // Bloco de glicemia
      } else if (document.getElementById("lembrete-insulina").checked) {
        return document.getElementById("block-14"); // Bloco de insulina
      } else if (document.getElementById("lembrete-consulta").checked) {
        return document.getElementById("block-consulta"); // Bloco de próxima consulta
      } else if (document.getElementById("lembrete-documentacao").checked) {
        return document.getElementById("block-16"); // Bloco de documentação
      } else {
        return document.getElementById("block-final"); // Bloco final como fallback
      }
    } else if (currentId === "block-11") {
      // Após o bloco de comida
      if (document.getElementById("lembrete-agua").checked) {
        return document.getElementById("block-12"); // Bloco de água
      } else if (document.getElementById("lembrete-glicemia").checked) {
        return document.getElementById("block-13"); // Bloco de glicemia
      } else if (document.getElementById("lembrete-insulina").checked) {
        return document.getElementById("block-14"); // Bloco de insulina
      } else if (document.getElementById("lembrete-consulta").checked) {
        return document.getElementById("block-consulta"); // Bloco de próxima consulta
      } else if (document.getElementById("lembrete-documentacao").checked) {
        return document.getElementById("block-16"); // Bloco de documentação
      } else {
        return document.getElementById("block-final"); // Bloco final como fallback
      }
    } else if (currentId === "block-12") {
      // Após o bloco de água
      if (document.getElementById("lembrete-glicemia").checked) {
        return document.getElementById("block-13"); // Bloco de glicemia
      } else if (document.getElementById("lembrete-insulina").checked) {
        return document.getElementById("block-14"); // Bloco de insulina
      } else if (document.getElementById("lembrete-consulta").checked) {
        return document.getElementById("block-consulta"); // Bloco de próxima consulta
      } else if (document.getElementById("lembrete-documentacao").checked) {
        return document.getElementById("block-16"); // Bloco de documentação
      } else {
        return document.getElementById("block-final"); // Bloco final como fallback
      }
    } else if (currentId === "block-13") {
      // Após o bloco de glicemia
      if (document.getElementById("lembrete-insulina").checked) {
        return document.getElementById("block-14"); // Bloco de insulina
      } else if (document.getElementById("lembrete-consulta").checked) {
        return document.getElementById("block-consulta"); // Bloco de próxima consulta
      } else if (document.getElementById("lembrete-documentacao").checked) {
        return document.getElementById("block-16"); // Bloco de documentação
      } else {
        return document.getElementById("block-final"); // Bloco final como fallback
      }
    } else if (currentId === "block-14") {
      // Após o bloco de insulina - CORRIGIDO
      if (document.getElementById("lembrete-consulta").checked) {
        return document.getElementById("block-consulta"); // Bloco de próxima consulta
      } else if (document.getElementById("lembrete-documentacao").checked) {
        return document.getElementById("block-16"); // Bloco de documentação
      } else {
        return document.getElementById("block-final"); // Bloco final como fallback
      }
    } else if (currentId === "block-consulta" || currentId === "block-16") {
      // Após os blocos de próxima consulta ou documentação
      return document.getElementById("block-final"); // Bloco final
    } else {
      // Para qualquer outro bloco, ir para o bloco final
      return document.getElementById("block-final");
    }
  }

  // Função para atualizar a barra de progresso
  function updateProgressBar() {
    const activeBlock = document.querySelector(".form-block.active");
    const activeIndex = Array.from(blocks).indexOf(activeBlock);
    const progressPercentage = (activeIndex / (blocks.length - 1)) * 100;
    progress.style.width = `${progressPercentage}%`;
  }
}

// Função para validar campos obrigatórios
function validateRequiredFields(block) {
  const requiredInputs = block.querySelectorAll(
    "input[required], select[required]"
  );
  let isValid = true;

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;

      // Destacar campo com erro
      input.style.borderColor = "red";

      // Adicionar mensagem de erro se não existir
      let errorMsg = input.nextElementSibling;
      if (!errorMsg || !errorMsg.classList.contains("error-message")) {
        errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Este campo é obrigatório";
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "12px";
        errorMsg.style.marginTop = "5px";
        input.parentNode.insertBefore(errorMsg, input.nextSibling);
      } else {
        errorMsg.style.display = "block";
      }
    } else {
      // Remover destaque de erro
      input.style.borderColor = "";

      // Ocultar mensagem de erro se existir
      const errorMsg = input.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains("error-message")) {
        errorMsg.style.display = "none";
      }
    }
  });

  return isValid;
}

// Função para configurar adição e remoção de remédios
function setupRemediosAddition() {
  const addRemedioBtn = document.getElementById("add-remedio");
  const remediosContainer = document.getElementById("remedios-container");

  if (!addRemedioBtn || !remediosContainer) return;

  let remedioCount = 1;
  const maxRemedios = 5;

  // Adicionar um X no canto superior direito da aba de remédios
  const remedioTabs = document.querySelector(".remedio-tabs");
  if (remedioTabs) {
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "close-tab";
    closeBtn.innerHTML = "&#10005;"; // X symbol
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.background = "none";
    closeBtn.style.border = "none";
    closeBtn.style.fontSize = "18px";
    closeBtn.style.cursor = "pointer";

    closeBtn.addEventListener("click", function () {
      remedioTabs.style.display = "none";
    });

    remedioTabs.style.position = "relative";
    remedioTabs.appendChild(closeBtn);
  }

  addRemedioBtn.addEventListener("click", () => {
    if (remedioCount < maxRemedios) {
      remedioCount++;

      const newRemedioItem = document.createElement("div");
      newRemedioItem.className = "remedio-item";
      newRemedioItem.id = `remedio-${remedioCount}`;

      newRemedioItem.innerHTML = `
          <div class="remedio-header">
            <h3>Remédio ${remedioCount}</h3>
            <button type="button" class="remove-remedio" aria-label="Remover remédio">❌</button>
          </div>
          <div class="form-group">
            <label for="remedio-${remedioCount}-nome">Nome do remédio</label>
            <input type="text" id="remedio-${remedioCount}-nome" name="remedio-${remedioCount}-nome" required>
          </div>
          <div class="form-group">
            <label for="remedio-${remedioCount}-frequencia">Frequência</label>
            <select id="remedio-${remedioCount}-frequencia" name="remedio-${remedioCount}-frequencia" required>
              <option value="">Selecione a frequência</option>
              <option value="6h">a cada 6h</option>
              <option value="8h">a cada 8h</option>
              <option value="12h">a cada 12h</option>
              <option value="1x-dia">1x ao dia</option>
              <option value="2-dias">a cada 2 dias</option>
              <option value="1x-semana">1x na semana</option>
              <option value="15-dias">1x cada 15 dias</option>
            </select>
          </div>
          <div class="form-group">
            <label for="remedio-${remedioCount}-data">Próxima data</label>
            <input type="date" id="remedio-${remedioCount}-data" name="remedio-${remedioCount}-data" min="2025-01-01" required>
            <div class="date-warning" style="display: none; color: red; font-size: 12px;">
              Por favor, selecione uma data a partir de 2025.
            </div>
          </div>
          <div class="form-group">
            <label for="remedio-${remedioCount}-horario">Horário para o lembrete</label>
            <select id="remedio-${remedioCount}-horario" name="remedio-${remedioCount}-horario" required>
              <!-- Opções de horário serão preenchidas via JavaScript -->
            </select>
          </div>
          <div class="form-group">
            <label for="remedio-${remedioCount}-duracao">Por quanto tempo será dado?</label>
            <select id="remedio-${remedioCount}-duracao" name="remedio-${remedioCount}-duracao" required>
              <option value="">Selecione a duração</option>
              <option value="2">2 dias</option>
              <option value="3">3 dias</option>
              <option value="4">4 dias</option>
              <option value="5">5 dias</option>
              <option value="7">7 dias</option>
              <option value="10">10 dias</option>
              <option value="14">14 dias</option>
              <option value="15">15 dias</option>
              <option value="21">21 dias</option>
              <option value="30">30 dias</option>
              <option value="indeterminado">tempo indeterminado</option>
              <option value="outro">outro (especifique)</option>
            </select>
          </div>
          <div class="form-group outro-duracao" id="remedio-${remedioCount}-outro-container" style="display: none;">
            <label for="remedio-${remedioCount}-outro">Especifique a duração</label>
            <input type="text" id="remedio-${remedioCount}-outro" name="remedio-${remedioCount}-outro">
          </div>
        `;

      remediosContainer.appendChild(newRemedioItem);

      // Preencher opções de horário
      fillTimeOptions(
        document.getElementById(`remedio-${remedioCount}-horario`)
      );

      // Configurar evento para o campo "outro"
      const duracaoSelect = document.getElementById(
        `remedio-${remedioCount}-duracao`
      );
      const outroContainer = document.getElementById(
        `remedio-${remedioCount}-outro-container`
      );

      duracaoSelect.addEventListener("change", function () {
        if (this.value === "outro") {
          outroContainer.style.display = "block";
        } else {
          outroContainer.style.display = "none";
        }
      });

      // Configurar validação de data
      const dataInput = document.getElementById(`remedio-${remedioCount}-data`);
      const dateWarning = dataInput.nextElementSibling;

      dataInput.addEventListener("change", function () {
        validateFutureDate(this, dateWarning);
      });

      // Configurar botão de remover remédio
      const removeButton = newRemedioItem.querySelector(".remove-remedio");
      removeButton.addEventListener("click", function () {
        newRemedioItem.remove();
        remedioCount--;

        // Reativar botão de adicionar
        addRemedioBtn.disabled = false;

        // Remover aviso de limite máximo se estiver visível
        const maxWarning = document.getElementById("max-remedios-warning");
        if (maxWarning) {
          maxWarning.style.display = "none";
        }

        // Reorganizar os IDs dos remédios restantes
        reorganizeRemedios();
      });

      // Desabilitar botão de adicionar se atingir o máximo
      if (remedioCount >= maxRemedios) {
        addRemedioBtn.disabled = true;

        // Mostrar aviso de limite máximo
        let maxWarning = document.getElementById("max-remedios-warning");
        if (!maxWarning) {
          maxWarning = document.createElement("div");
          maxWarning.id = "max-remedios-warning";
          maxWarning.className = "warning-message";
          maxWarning.textContent = "Limite máximo de 5 remédios atingido!";
          maxWarning.style.color = "#856404";
          maxWarning.style.backgroundColor = "#fff3cd";
          maxWarning.style.padding = "10px";
          maxWarning.style.borderRadius = "5px";
          maxWarning.style.marginTop = "10px";
          maxWarning.style.textAlign = "center";

          // Inserir após o botão de adicionar
          addRemedioBtn.parentNode.insertBefore(
            maxWarning,
            addRemedioBtn.nextSibling
          );
        } else {
          maxWarning.style.display = "block";
        }
      }
    } else {
      // Mostrar aviso de limite máximo quando tentar adicionar mais de 5
      let maxWarning = document.getElementById("max-remedios-warning");
      if (!maxWarning) {
        maxWarning = document.createElement("div");
        maxWarning.id = "max-remedios-warning";
        maxWarning.className = "warning-message";
        maxWarning.textContent = "Limite máximo de 5 remédios atingido!";
        maxWarning.style.color = "#856404";
        maxWarning.style.backgroundColor = "#fff3cd";
        maxWarning.style.padding = "10px";
        maxWarning.style.borderRadius = "5px";
        maxWarning.style.marginTop = "10px";
        maxWarning.style.textAlign = "center";

        // Inserir após o botão de adicionar
        addRemedioBtn.parentNode.insertBefore(
          maxWarning,
          addRemedioBtn.nextSibling
        );
      } else {
        maxWarning.style.display = "block";
      }
    }
  });

  // Adicionar botão de remover ao primeiro remédio também
  const firstRemedioItem = document.getElementById("remedio-1");
  if (firstRemedioItem) {
    const remedioHeader = document.createElement("div");
    remedioHeader.className = "remedio-header";

    // Mover o título existente para o header
    const title =
      firstRemedioItem.querySelector("h3") || document.createElement("h3");
    if (!title.textContent) title.textContent = "Remédio 1";

    remedioHeader.appendChild(title);

    // Adicionar botão de remover
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-remedio";
    removeButton.setAttribute("aria-label", "Remover remédio");
    removeButton.textContent = "❌";
    removeButton.addEventListener("click", function () {
      // Limpar os campos em vez de remover o primeiro remédio
      const inputs = firstRemedioItem.querySelectorAll("input, select");
      inputs.forEach((input) => {
        if (input.type === "text" || input.type === "date") {
          input.value = "";
        } else if (input.tagName === "SELECT") {
          input.selectedIndex = 0;
        }
      });

      // Esconder o container "outro" se estiver visível
      const outroContainer = document.getElementById(
        "remedio-1-outro-container"
      );
      if (outroContainer) {
        outroContainer.style.display = "none";
      }
    });

    remedioHeader.appendChild(removeButton);

    // Inserir o header no início do primeiro remédio
    firstRemedioItem.insertBefore(remedioHeader, firstRemedioItem.firstChild);
  }

  // Função para reorganizar os IDs dos remédios após remoção
  function reorganizeRemedios() {
    const remedioItems = document.querySelectorAll(".remedio-item");
    remedioItems.forEach((item, index) => {
      const newIndex = index + 1;
      item.id = `remedio-${newIndex}`;

      // Atualizar o título
      const title = item.querySelector("h3");
      if (title) {
        title.textContent = `Remédio ${newIndex}`;
      }

      // Atualizar os IDs e names dos campos
      const inputs = item.querySelectorAll("input, select");
      inputs.forEach((input) => {
        const fieldName = input.id.split("-").slice(2).join("-");
        input.id = `remedio-${newIndex}-${fieldName}`;
        input.name = `remedio-${newIndex}-${fieldName}`;
      });

      // Atualizar o ID do container "outro"
      const outroContainer = item.querySelector(".outro-duracao");
      if (outroContainer) {
        outroContainer.id = `remedio-${newIndex}-outro-container`;
      }
    });
  }
}

// Função para configurar o campo "outro" para duração de remédios
function setupOutroDuracao() {
  // Configurar o primeiro remédio
  const duracaoSelect = document.getElementById("remedio-1-duracao");
  const outroContainer = document.getElementById("remedio-1-outro-container");

  if (duracaoSelect && outroContainer) {
    duracaoSelect.addEventListener("change", function () {
      if (this.value === "outro") {
        outroContainer.style.display = "block";
      } else {
        outroContainer.style.display = "none";
      }
    });
  }
}

// Função para validar datas futuras (2025+)
function validateFutureDate(dateInput, warningElement) {
  const selectedDate = new Date(dateInput.value);
  const minYear = 2025;

  if (selectedDate.getFullYear() < minYear) {
    warningElement.style.display = "block";
    dateInput.style.borderColor = "red";
    return false;
  } else {
    warningElement.style.display = "none";
    dateInput.style.borderColor = "";
    return true;
  }
}

// Função para configurar validação de datas
function setupDateValidation() {
  // Configurar validação para todas as entradas de data
  const dateInputs = document.querySelectorAll('input[type="date"]');

  dateInputs.forEach((input) => {
    // Definir o atributo min para 2025-01-01
    input.setAttribute("min", "2025-01-01");

    // Adicionar elemento de aviso se não existir
    let warningElement = input.nextElementSibling;
    if (!warningElement || !warningElement.classList.contains("date-warning")) {
      warningElement = document.createElement("div");
      warningElement.className = "date-warning";
      warningElement.style.display = "none";
      warningElement.style.color = "red";
      warningElement.style.fontSize = "12px";
      warningElement.textContent =
        "Por favor, selecione uma data a partir de 2025.";
      input.parentNode.insertBefore(warningElement, input.nextSibling);
    }

    // Adicionar evento de validação
    input.addEventListener("change", function () {
      validateFutureDate(this, warningElement);
    });
  });
}

// Função para configurar validação de WhatsApp
function setupWhatsAppValidation() {
  const whatsappInput = document.getElementById("whatsappTutor");
  if (!whatsappInput) return;

  whatsappInput.addEventListener("input", function () {
    // Remover tudo que não for número
    let value = this.value.replace(/\D/g, "");

    // Limitar a 11 dígitos (DDD + número)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Formatar como (XX) XXXXX-XXXX
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }

    this.value = value;
  });
}

// Função para configurar exibição do nome do pet
function setupPetNameDisplay() {
  const petNameInput = document.getElementById("nomePet");
  const petNameDisplays = document.querySelectorAll(".pet-name-display");

  if (!petNameInput || petNameDisplays.length === 0) return;

  // Atualizar todos os displays quando o nome do pet mudar
  petNameInput.addEventListener("input", function () {
    const petName = this.value.trim() || "seu pet";
    petNameDisplays.forEach((display) => {
      display.textContent = petName;
    });
  });

  // Inicializar com o valor atual (se houver)
  const initialPetName = petNameInput.value.trim() || "seu pet";
  petNameDisplays.forEach((display) => {
    display.textContent = initialPetName;
  });
}

// Função para configurar lógica condicional para blocos
function setupConditionalBlocks() {
  // Implementar lógica específica para blocos condicionais
}

// Função para configurar botão de compartilhar via WhatsApp
function setupShareWhatsApp() {
  // Configurar o botão de compartilhar via WhatsApp
  const shareBtn = document.getElementById("share-whatsapp");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      const petName =
        document.querySelector(".pet-name-display").textContent || "seu pet";
      const text = encodeURIComponent(
        `Oi! Acabei de configurar alguns lembretes pra lembrar das coisas d ${petName}. Aqui tá o formulário: `
      );
      const url = encodeURIComponent(window.location.href);
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, "_blank");
    });
  }
}

// Função para configurar envio do formulário
function setupFormSubmission() {
  // Configurar o botão de envio final
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      submitFormData();
    });
  }
}

// Função para coletar e enviar os dados do formulário
function submitFormData() {
  // Mostrar mensagem de carregamento
  const successMessage = document.getElementById("success-message");
  if (successMessage) {
    successMessage.textContent = "Enviando dados...";
    successMessage.style.display = "block";
  }

  // Coletar todos os dados do formulário
  const formData = {
    // Dados do tutor
    nomeTutor: document.getElementById("nomeTutor")?.value || "",
    sobrenomeTutor: document.getElementById("sobrenomeTutor")?.value || "",
    whatsappTutor: document.getElementById("whatsappTutor")?.value || "",

    // Nome do pet
    nomePet: document.getElementById("nomePet")?.value || "",

    // Lembretes selecionados
    lembretesSelecionados: Array.from(
      document.querySelectorAll('input[name="lembretes"]:checked')
    )
      .map((cb) => cb.value)
      .join(","),

    // Vacinas selecionadas
    vacinasSelecionadas: Array.from(
      document.querySelectorAll('input[name="vacinas"]:checked')
    )
      .map((cb) => cb.value)
      .join(","),

    // Dados das vacinas
    vacinaPolivalenteData:
      document.getElementById("data-polivalente")?.value || "",
    vacinaAntirrabicaData:
      document.getElementById("data-antirrabica")?.value || "",
    vacinaGripeData: document.getElementById("data-gripe")?.value || "",
    vacinaGiardiaData: document.getElementById("data-giardia")?.value || "",

    // Dados dos remédios
    remedios: collectRemediosData(),

    // Dados das refeições
    refeicoes: collectItemsData("refeicao", "refeicoes-quantidade"),

    // Dados da água
    agua: collectItemsData("agua", "agua-quantidade"),

    // Dados da glicemia
    glicemia: collectItemsData("glicemia", "glicemia-quantidade"),

    // Dados da insulina
    insulina: collectItemsData("insulina", "insulina-quantidade"),

    // Próxima consulta
    proximaConsulta: document.getElementById("proxima-consulta")?.value || "",

    // Documentação do dia
    documentacaoDias: Array.from(
      document.querySelectorAll('input[name="dias-semana"]:checked')
    )
      .map((cb) => cb.value)
      .join(","),
    documentacaoHorario:
      document.getElementById("documentacao-horario")?.value || "",
  };

  console.log("Dados coletados:", formData);

  // Enviar dados para o Google Apps Script
  sendDataToGoogleSheet(formData);
}

// Função para coletar dados dos remédios
function collectRemediosData() {
  const remedios = [];
  const remedioItems = document.querySelectorAll(".remedio-item");

  remedioItems.forEach((item, index) => {
    const remedioId = index + 1;
    const nome =
      document.getElementById(`remedio-${remedioId}-nome`)?.value || "";

    if (nome) {
      const frequencia =
        document.getElementById(`remedio-${remedioId}-frequencia`)?.value || "";
      const data =
        document.getElementById(`remedio-${remedioId}-data`)?.value || "";
      const horario =
        document.getElementById(`remedio-${remedioId}-horario`)?.value || "";
      const duracao =
        document.getElementById(`remedio-${remedioId}-duracao`)?.value || "";
      let duracaoFinal = duracao;

      if (duracao === "outro") {
        duracaoFinal =
          document.getElementById(`remedio-${remedioId}-outro`)?.value || "";
      }

      remedios.push({
        nome,
        frequencia,
        data,
        horario,
        duracao: duracaoFinal,
      });
    }
  });

  return remedios;
}

// Função para enviar dados para o Google Apps Script
function sendDataToGoogleSheet(formData) {
  // URL do seu Google Apps Script Web App
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyiHnkZWFtQwXEvZXwrre2QG5kmS4AxrprACMNxAfvVP9euoRYtvNmbTuaCwUn7pPgU/exec";

  console.log("Enviando dados para:", scriptURL);

  // Usando fetch com modo no-cors para evitar problemas de CORS
  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors", // Importante: isso evita erros de CORS
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(() => {
      // Como estamos usando no-cors, não podemos ler a resposta,
      // mas podemos assumir que foi bem-sucedido se não houver erro
      console.log("Dados enviados com sucesso!");

      // Mostrar mensagem de sucesso
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.textContent = "Dados enviados com sucesso! 🎉";
        successMessage.style.display = "block";
      }

      // Mostrar o container de compartilhamento
      const shareContainer = document.querySelector(".share-container");
      if (shareContainer) {
        shareContainer.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.textContent =
          "Erro ao enviar os dados. Tente novamente.";
        successMessage.style.color = "red";
        successMessage.style.backgroundColor = "#f8d7da";
        successMessage.style.display = "block";
      }
    });
}

// Função para coletar dados dos campos dinâmicos (refeições, água, glicemia, insulina)
function collectItemsData(prefix, quantityInputId) {
  const quantity =
    parseInt(document.getElementById(quantityInputId)?.value) || 0;
  const items = [];

  for (let i = 1; i <= quantity; i++) {
    const horario =
      document.getElementById(`${prefix}-${i}-horario`)?.value || "";
    if (horario) {
      items.push({ horario });
    }
  }

  return items;
}

// Executar o código quando o DOM estiver carregado
console.log("Script carregado e pronto para execução");
