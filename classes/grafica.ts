export class GraficaData {
    private preguntas: string[] = ['pregunta1', 'pregunta2', 'pregunta3', 'pregunta4'];
    private valores: number[] = [0, 0, 0, 0];

    constructor() { }

    getDataGrafica() {
        return [
            { data: [this.valores], label: 'Preguntas' }
        ];
    }

    incrementarValor(pregunta: string, valor: number) {
        pregunta = pregunta.toLowerCase().trim();

        for (let i in this.preguntas) {
            if (this.preguntas[i] === pregunta) {
                this.valores[i] += valor;
            }
        }

        return this.getDataGrafica();
    }


}