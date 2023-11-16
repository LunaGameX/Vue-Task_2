let eventBus = new Vue()

Vue.component('columns', {
    template: `
    <div id="cols">
        <p class="error" v-if="errors.length"
              v-for="error in errors">
                {{ error }}
        </p>
        <fill></fill>
        <col1 class="col" :column1="column1"></col1>
        <col2 class="col" :column2="column2"></col2>
        <col3 class="col" :column3="column3"></col3>
    </div>
    `,
    data() {
        return {
            errors: [],
            column1: [],
            column2: [],
            column3: [],
        }
    },
    mounted() {
        eventBus.$on('card-submitted', card => {
            this.errors = []
            if (this.column1.length < 3) {
                this.column1.push(card)
                console.log()
            } else {
                this.errors.push('Нельзя больше добавить')
            }
        })

        eventBus.$on('to-column2', card => {
            this.errors = []
            if (this.column2.length < 5) {
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
            } else {
                this.errors.push('Завершите все задачи в одной из заметок')
            }
        })
        eventBus.$on('to-column3', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })
        eventBus.$on('to-column1-3', card => {
            this.column3.push(card)
            this.column1.splice(this.column2.indexOf(card), 1)
        })
    },


})

Vue.component('fill', {
    props: {
        column1: {
            type: Array,
            required: true
        },
        errors: {
            type: Array,
            required: true
        },
    },
    template: `
    <div>
        <form @submit.prevent="onSubmit" >
            <input required type="text" v-model="title" placeholder="Название заметки">
            <ul>
                <input required type="text" v-model="task_1" placeholder="Задача"><br><br>
                <input required type="text" v-model="task_2" placeholder="Задача"><br><br>
                <input required type="text" v-model="task_3" placeholder="Задача"><br><br>
                <input type="text" v-model="task_4" placeholder="Задача"><br><br>
                <input type="text" v-model="task_5" placeholder="Задача"><br><br>
                
                <input type="submit" value="Добавить">  
                
            </ul>
        </form>
                   
    </div>
    `,
    data() {
        return {
            title: null,
            task_1: null,
            task_2: null,
            task_3: null,
            task_4: null,
            task_5: null,
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                tasks: [{text: this.task_1, completed: false},
                    {text: this.task_2, completed: false},
                    {text: this.task_3, completed: false},
                    {text: this.task_4, completed: false},
                    {text: this.task_5, completed: false}],
                date: new Date().toLocaleString(),
                status: 0,
            }
            eventBus.$emit('card-submitted', card)
            this.title = null
            this.task_1 = null
            this.task_2 = null
            this.task_3 = null
            this.task_4 = null
            this.task_5 = null
            this.date = null
        },
    }
})



let app = new Vue({
    el: '#app',
    data: {}
})