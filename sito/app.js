const app = Vue.createApp({
    data() {
        return {
            user: 'Mario',
            saldo: 5,
            eventi: [
                { nome: 'Inter - Milan', quote: '1.5 - 2.5' },
                { nome: 'Juventus - Napoli', quote: '1.7 - 2.3' },
                { nome: 'Roma - Lazio', quote: '1.6 - 2.4' }
            ],
            scommesse: [],
            utenti: [
                { nome: 'Mario' },
                { nome: 'Luca' },
                { nome: 'Giovanni' }
            ]
        }
    },
    methods: {
        scommetti(evento) {
            const importo = prompt('Inserisci l\'importo della scommessa');
            if (importo > this.saldo) {
                alert('Non hai abbastanza soldi');
                return;
            } else {

                this.saldo -= importo;
                this.scommesse.push({ nome: evento.nome, scommessa: evento.quote, importo: importo });
            }
        }
    }
})
app.mount('#app')