
class Pila {
    constructor(){
        this.pila = {};
        this.top = 0
    }

    agregar(dato) {
        this.top++;
        this.pila[this.top] = dato;
    }

    quitar(){
        let dato;
        dato = this.pila[this.top];
        delete this.pila[this.top];
        this.top--;
        return dato;
    }

    size() {
        return this.top;
    }

    vacia() {
        return (!this.size()) ? true : false;
    }
}

const transformar = (arrNotacion, resultado) => {
    arrNotacion.map((e,i) => {
        if (isNaN(e)) resultado.pila.agregar(e);

        if (!isNaN(arrNotacion[i+1])) {
            resultado.numeros.push(arrNotacion[i+1]);
            if (!resultado.pila.vacia()) resultado.operadores.push(resultado.pila.quitar()) 
        } 
    });
    return {numeros: resultado.numeros, operadores: resultado.operadores};
}

// Evento click
document.getElementById('btn').addEventListener('click', () => {
    let notacion = document.getElementById('notacion').value;
    if (notacion.trim() === '') {
        Swal.fire({
            icon: 'error',
            text: 'Ingrese notación polaca',
        });
        return;
    }

    if (/^[a-zA-Z]+$/.test(notacion)) {
        Swal.fire({
            icon: 'error',
            text: 'Ingrese números y operadores (+, -, *, /), no solo letras',
        });
        return;
    }

    let arrNotacion = notacion.split(' ');

    // Validar que cada elemento sea un operando o un número
    for (let i = 0; i < arrNotacion.length; i++) {
        const elemento = arrNotacion[i];
        if (!/^[+\-*/]$/.test(elemento) && isNaN(elemento)) {
            Swal.fire({
                icon: 'error',
                text: 'Ingrese números y operadores (+, -, *, /) válidos',
            });
            return;
        }
    }

    // Validar que no haya operandos consecutivos
    for (let i = 0; i < arrNotacion.length - 1; i++) {
        const elemento = arrNotacion[i];
        const siguiente = arrNotacion[i + 1];
        if (/^[+\-*/]$/.test(elemento) && /^[+\-*/]$/.test(siguiente)) {
            Swal.fire({
                icon: 'error',
                text: 'No pueden haber operandos consecutivos',
            });
            return;
        }
    }

    // Validar que no haya números negativos sin operador previo
    for (let i = 0; i < arrNotacion.length; i++) {
        const elemento = arrNotacion[i];
        if (elemento.startsWith('-') && i === 0) {
            Swal.fire({
                icon: 'error',
                text: 'No puede haber números negativos al principio de la expresión',
            });
            return;
        } else if (elemento.startsWith('-') && !/^[+\-*/]$/.test(arrNotacion[i - 1])) {
            Swal.fire({
                icon: 'error',
                text: 'No puede haber números negativos sin operador previo',
            });
            return;
        }
    }
    

    const pila = new Pila();
    const resultado = {numeros: [], operadores: [], pila: pila};
    const transformado = transformar(arrNotacion, resultado);
    const expresion = transformado.numeros.concat(transformado.operadores);

    // Validación para asegurarse de que la notación sea correcta
    if (expresion.length === 0 || isNaN(expresion[0])) {
        
    }

    for (let i = 0; i < expresion.length; i++) {
        const token = expresion[i];

        if (i === 0 && !isNaN(token)) {
            continue;
        }

    }

    const operaciones = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => {
            if (b === 0) {
                Swal.fire({
                    icon: 'error',
                    text: 'Error: División por cero.',
                });
                return;
            }
            return a / b;
        },
    };

    const precedencia = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
    };

    const polacaAInfija = (expresionPolaca) => {
        const pila = [];
        for (let i = 0; i < expresionPolaca.length; i++) {
            const token = expresionPolaca[i];
            if (!isNaN(token)) {
                pila.push(token);
            } else {
                const b = pila.pop();
                const a = pila.pop();
                pila.push(`${a} ${token} ${b}`);
            }
        }
        return pila[0];
    }
    
    const expresionPolaca = transformado.numeros.concat(transformado.operadores);
    const expresionInfija = polacaAInfija(expresionPolaca);
    

    const salida = [];
    const operadorPila = [];

    for (let i = 0; i < expresion.length; i++) {
        const token = expresion[i];

        if (!isNaN(token)) {
            salida.push(parseFloat(token));
        } else if (token in operaciones) {
            while (operadorPila.length > 0 && 
                operadorPila[operadorPila.length - 1] in operaciones && 
                precedencia[operadorPila[operadorPila.length - 1]] >= precedencia[token]) {
                salida.push(operadorPila.pop());
            }
            operadorPila.push(token);
        }
    }

    while (operadorPila.length > 0) {
        salida.push(operadorPila.pop());
    }

    const resultadoCalculo = [];
    for (let i = 0; i < salida.length; i++) {
        const token = salida[i];

        if (!isNaN(token)) {
            resultadoCalculo.push(token);
        } else if (token in operaciones) {
            const b = resultadoCalculo.pop();
            const a = resultadoCalculo.pop();
            const resultado = operaciones[token](a, b);
            
            if (isNaN(resultado)) {
                Swal.fire({
                    icon: 'error',
                    text: 'Error: Resultado inválido.',
                });
                return;
            }
            
            resultadoCalculo.push(resultado);
        }
    }

    if (resultadoCalculo.length !== 1) {
        Swal.fire({
            icon: 'error',
            text: 'Error al calcular el resultado.',
        });
        return;
    }

    document.getElementById('polaca').textContent = `Polaca: ${notacion}`;
    document.getElementById('exp').textContent = `Expresion: ${expresionInfija}`;
    document.getElementById('resultado').textContent = `Resultado: ${resultadoCalculo[0]}`;
    document.getElementById('notacion').value = expresionInfija;
    
});