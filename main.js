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

const pila = new Pila();

const transformar = (arrNotacion,resultado) => {
    arrNotacion.map((e,i) => {
        if (isNaN(e)) pila.agregar(e);
        
        if (!isNaN(arrNotacion[i+1])) {
            resultado.push(arrNotacion[i+1]);
            if (!pila.vacia()) resultado.push(pila.quitar()) 
        } 
    });
    return resultado;
}

document.getElementById('btn').addEventListener('click',() => {
    let notacion = document.getElementById('notacion').value;
    if (notacion.trim() === '') {
        Swal.fire({
            icon: 'error',
            text: 'Ingrese notación',
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

    let resultado = [];
    
    let arrNotacion = notacion.split(' ');    
    
    resultado = transformar(arrNotacion,resultado);
    resultado = resultado.join().replaceAll(',',' ');

    document.getElementById('polaca').textContent = `Polaca: ${notacion}`; 
    document.getElementById('exp').textContent = `Expresion: ${resultado}`; 
    document.getElementById('resultado').textContent = `Resultado: ${eval(resultado)}`; 
    document.getElementById('notacion').value = '';
});