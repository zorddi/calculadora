const Get = {
    id(name){
        return document.getElementById(name);
    },
    query(name){
        return document.querySelector(name);
    },
    queryAll(name){
        return document.querySelectorAll(name);
    }
}

function ifTemplate(element, param){
    if (!element){
        console.error('Função "ifTemplate" encerrada: o valor "element" permanece "undefined". Por favor, insira um elemento válido.');
        return null;
    }

    if (!param){
        console.error('Objeto "disabledAttr" encerrado: o valor "param" se encontra "undefined". Por favor, insira "add" ou "rm" como valor.');
        return null;
    }

    if (typeof param !== "string"){
        console.error('Objeto "disabledAttr" encerrado: o valor "param" não é uma "string". Por favor, insira "add" ou "rm" como valor.');
        return null;
    } else {
        if (param !== "add"){
            if (param !== "rm"){
                console.error('Objeto "disabledAttr" finalizado: qualquer coisa diferente de "add" ou "rm" será considerado inválido.');
                return null;
            }
        }
    }

    if (param === "add"){
        if (element.getAttribute('disabled') === true){
            return;
        }

        element.setAttribute('disabled', 'true');
    } else {
        if (element.getAttribute('disabled') === null){
            return;
        }

        element.removeAttribute('disabled');
    }
}

const disabledAttr = {
    operator(param){
        typeOperator.forEach((operator) => {
            ifTemplate(operator, param);
        });

        return this;
    },
    point(param){
        ifTemplate(point, param);

        return this;
    }
};

// Selecionando IDs
const display = Get.id('display');
const point = Get.id('point');
const equalButton = Get.id('equal');
const clear = Get.id('clear');

// Selecionando Class
const buttons = Get.queryAll('.button');
const typeNumber = Get.queryAll('.number');
const typeOperator = Get.queryAll('.operator');

// Se o atributo "readonly" for removido, ele será inserido logo em seguida
let observer = new MutationObserver(() => {
    if (!display.hasAttribute('readonly')){
        display.setAttribute('readonly', 'true');
    }
});
observer.observe(display, {
    attributes: true,
    subtree: true,
});

function regex(){
    if (/[0-9]+$/.test(display.value) === true){
        operatorClicked = false;
        disabledAttr.operator('rm');
    } else if (/[0.-9]+$/.test(display.value) === true){
        disabledAttr.point('add');
    } else if (/[+-÷×]$/.test(display.value) === true){
        operatorClicked = true;
        disabledAttr.operator('add').point('rm');
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace'){

        if (display.value === ''){
            return;
        } else{
            display.value = display.value.slice(0, -1);
        }
        regex();
    } else{
        return;
    }
});

// Escreve no display
buttons.forEach((e) => {
    e.addEventListener('click', function(){
        display.value += this.textContent;
        regex();
    });
});

// Reseta a calculadora
clear.addEventListener('click', function(){
    numberClicked = false;
    operatorClicked = false;
    display.value = '';
    disabledAttr.operator("add").point("rm");
});

// Realiza o calculo
equal.addEventListener('click', function(event){
    // Cálculo e tratamento
    const value = display.value.replace('÷', '/').replace('×', '*');
    try {
        const calc = math.evaluate(value);
        if (isNaN(calc)) {
            display.value = 'erro';
        } else {
            display.value = calc;
        }
    } catch (e) {
        display.value = 'erro';
    }

    // Verifica se o resultado já possui vírgula:
    // se sim, "point" não será interativo até que o próximo operador ser definido.
    if (/\./.test(display.value) === true){
        disabledAttr.point("add");
    }
});