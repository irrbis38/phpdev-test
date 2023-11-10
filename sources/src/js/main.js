document.addEventListener("DOMContentLoaded", () => {
  var dropdown = document.querySelector(".filter__dropdown");
  var items_container = document.querySelector(".filter__items-container");
  var fitems_all = document.querySelectorAll(".fitems");
  var active_fitems = document.querySelector(".fitems.active");
  var ftabs_buttons = document.querySelectorAll(".ftabs__btn");
  var inputs = Array.from(document.querySelectorAll(".fitems__input"));
  var fbutton = document.querySelector(".fbutton");
  var fbutton_amount = document.querySelector(".fbutton__amount");
  var flabels = document.querySelector(".flabels");

  // toggle dropdown
  fbutton.addEventListener("click", () =>
    requestAnimationFrame(() => dropdown.classList.toggle("opened"))
  );

  // check scroll height on load
  requestAnimationFrame(() =>
    checkScrollPosition(items_container, active_fitems)
  );

  // check scroll height on scroll
  fitems_all.forEach((fitems) =>
    fitems.addEventListener("scroll", () =>
      requestAnimationFrame(() => checkScrollPosition(items_container, fitems))
    )
  );

  // switch tabs
  ftabs_buttons.forEach((btn, _, buttons) =>
    btn.addEventListener("click", () => {
      handleTabsButtons(btn, fitems_all, buttons);
      requestAnimationFrame(() => checkScrollPosition(items_container));
    })
  );

  // check inputs

  inputs.forEach((input, _, inputs) =>
    input.addEventListener("input", () => {
      var inputParams = {
        input,
        inputs,
        fbutton,
        fbutton_amount,
        flabels,
      };

      requestAnimationFrame(() => handleInput(inputParams));
    })
  );
});

// == FUNCTIONS ==

// check scroll height

function checkScrollPosition(container, fitems) {
  var active_fitems = fitems || document.querySelector(".fitems.active");
  var itemsBottom = active_fitems.getBoundingClientRect().bottom;
  var itemsListBottom =
    active_fitems.children[0].getBoundingClientRect().bottom;

  itemsListBottom - itemsBottom < 48
    ? hideBlur(container)
    : showBlur(container);
}

function hideBlur(container) {
  container.classList.add("scrolled");
}

function showBlur(container) {
  container.classList.remove("scrolled");
}

// switch tabs

function handleTabsButtons(btn, fitems_all, buttons) {
  var isActiveTab = btn.classList.contains("active");
  var selectedDataTab = btn.dataset.tab;

  !isActiveTab && switchTabs(selectedDataTab, fitems_all, buttons);
}

function switchTabs(selectedDataTab, fitems_all, buttons) {
  buttons.forEach((btn) => toggleActiveElement(btn, selectedDataTab));
  fitems_all.forEach((fitems) => toggleActiveElement(fitems, selectedDataTab));
}

function toggleActiveElement(el, selectedDataTab) {
  var isSelected = el.dataset.tab === selectedDataTab;
  isSelected ? el.classList.add("active") : el.classList.remove("active");
}

// check inputs

function handleInput(inputParams) {
  determineSelectedInputs(inputParams);
  addLabel(inputParams);
}

function determineSelectedInputs(inputParams) {
  var { inputs, fbutton, fbutton_amount, flabels } = inputParams;

  var checked_inputs = inputs.filter((el) => el.checked === true);
  var len = checked_inputs.length;

  if (len > 0) {
    fbutton.classList.add("checked");
    flabels.classList.remove("empty");
  } else {
    fbutton.classList.remove("checked");
    flabels.classList.add("empty");
  }

  fbutton_amount.textContent = len;
}

function addLabel(inputParams) {
  var { input, flabels } = inputParams;
  var title = input.dataset.title;
  var id = input.id;

  var list = flabels.querySelector(".flabels__list");

  var flabels_buttons = Array.from(list.querySelectorAll(".flabels__btn"));

  var labelOfSelectedInput = flabels_buttons.find(
    (btn) => btn.dataset.id === id
  );

  if (labelOfSelectedInput) {
    labelOfSelectedInput.parentElement.remove();
  } else {
    // check with cross or without
    var isWithCross = flabels.dataset.cross === "with";
    var buttonClassName = "";

    isWithCross
      ? (buttonClassName = "flabels__btn flabels__btn--cross")
      : (buttonClassName = "flabels__btn");

    var li = document.createElement("LI");
    li.innerHTML = `<button class="${buttonClassName}" type="button" aria-label="Удалить фильтр Академический" data-id="${id}">${title}</button>`;

    li.children[0].addEventListener("click", () =>
      handleRemoveLabel(id, li, inputParams)
    );

    list.append(li);
  }
}

function handleRemoveLabel(id, li, inputParams) {
  var { inputs } = inputParams;
  li.remove();
  var input = inputs.find((input) => input.id === id);
  input.checked = false;

  determineSelectedInputs(inputParams);
}
