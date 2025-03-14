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

function flexEventListener(element, event, callback){
    if (!event){
        console.error('Função "flexEventListener()" encerrada: o parâmetro "event" está ausente. Verifique e forneça o evento corretamente.');
        return null;
    }

    if (typeof event !== "string"){
        console.error('Função "flexEventListener()" encerrada: o parâmetro "event" deve ser uma string. Verifique e forneça um valor válido para o evento.');
        return null;
    }

    if (typeof callback !== "function") {
        console.error("Função 'flexEventListener()' encerrada: o parâmetro 'callback' deve ser uma função. Verifique e forneça uma função válida.");
        return null;
    }

    const addListener = (e) => {
        e.addEventListener(event, function(){
            callback.call(this);
        });
    }

    if (element instanceof NodeList || Array.isArray(element)){
        element.forEach(addListener);
    } else{
        addListener(element);
    }
}

// Selecionando elementos e colocando em uma variável
const clear = Get.id('clear');
const output = Get.id('output');
const buttons = Get.queryAll('.button');
const typeNumber = Get.queryAll('.number');
const typeOperator = Get.queryAll('.operator');
const point = Get.id('point');
const equalButton = Get.id('equal');

flexEventListener(buttons, 'click', function(){
    output.value += this.textContent;
});

flexEventListener(typeNumber, 'click', function(){
    typeOperator.forEach((operator) => {
        operator.removeAttribute('disabled');
    });
});

flexEventListener(typeOperator, 'click', function(){
    typeOperator.forEach((all) => {
        all.setAttribute('disabled', 'true');
    });
    point.removeAttribute('disabled');
});

flexEventListener(point, 'click', function(){
    point.setAttribute('disabled', 'true');
});

flexEventListener(clear, 'click', function(){
    output.value = '';
    point.removeAttribute('disabled');
    typeOperator.forEach(all => {
        all.setAttribute('disabled', 'true');
    });
});

flexEventListener(equal, 'click', function(){
    const value = output.value.replace('÷', '/').replace('×', '*');
    try {
        const calc = math.evaluate(value);
        if (isNaN(calc)) {
            output.value = 'erro';
        } else {
            output.value = calc;
        }
    } catch (e) {
        output.value = 'erro';
    }
});