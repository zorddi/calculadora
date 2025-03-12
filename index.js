class Id {
    constructor(id){
        return document.getElementById(id);
    }
}

class Query extends Id {
    constructor(element){
        super(element);
        return document.querySelector(element);
    }
}

class QueryAll extends Query {
    constructor(element){
        return document.querySelectorAll(element);
    }
}

const historyDiv = new Id('history');
const clear = new Id('clear');
const output = new Id('output');
const buttons = new QueryAll('.button');
const typeNumber = new QueryAll('.number');
const typeOperator = new QueryAll('.operator');
const point = new Id('point');
const equalButton = new Id('equal');

point.disabled = false;

buttons.forEach((e) => {
    e.addEventListener('click', function(){
        output.value += this.textContent;
        historyDiv.innerText += this.textContent;
    });
});

typeNumber.forEach((e) => {
    e.addEventListener('click', () => {
        typeOperator.forEach((operator) => {
            operator.disabled = false;
        });
    });
});

typeOperator.forEach((e) => {
    e.addEventListener('click', () => {
        e.disabled = true;
        point.disabled = false;
    });
});

point.addEventListener('click', () => {
    point.disabled = true;
});

clear.addEventListener('click', () => {
    output.value = '';
    point.disabled = true;
    typeOperator.forEach((operator) => {
        operator.disabled = true;
    });

});

equal.addEventListener('click', () => {
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