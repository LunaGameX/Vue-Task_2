let eventBus = new Vue()

Vue.component('column_notes', {
    template: `
    <div id="cols">
        <p class="error" v-if="errors.length" 
                v-for="error in errors">
                   {{ error }}
        </p>
        <addCart></addCart>
        <column1 class="col" :column1="column1"></column1>
        <column2 class="col" :column2="column2"></column2>
        <column3 class="col" :column3="column3"></column3>
    </div>
    `,
    data() {
        return {
            errors: [],
            column1: [],
            column2: [],
            column3: []
        }
    },
    mounted() {
        eventBus.$on('submitted-cart', card => {
            this.errors = []
            if (this.column1.length < 3) {
                this.column1.push(card)
            } else {
                this.errors.push('макс колл-во задач в первом столбце')
            }
        })
        eventBus.$on('to-column2', card => {
            this.errors = []
            if (this.column2.length < 5) {
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
            } else if (this.column1.length > 0) {
                this.column1.forEach(items => {
                    items.tasks.forEach(items => {
                        items.completed = false;
                    })
                })
                this.errors.push('Вы не можете редактировать первую колонку, пока во второй есть 5 карточек.')
            }
        })
        eventBus.$on('to-column3', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })
    },
})

Vue.component('addCart', {
    template: `
    <section>
    <div xmlns="http://www.w3.org/1999/html"></div>
    <div>
        <button v-if="!show" @click="openModal" id="buttonModal">Добавьте задачу</button>
        <div id="form" v-if="show" class="modal-shadow">
            <div class="modal">
                <div class="modal-close" @click="closeModal">&#10006;</div>
                <h3>Заполните карточку задачи</h3>
                <form @submit.prevent="onSubmit">
                    
                     <input type="text" id="task_title" v-model="title" placeholder="Заголовок задачи" required></br>
                     <ul> 
                        <input type="text" id="task_1" v-model="task_1" placeholder="Задача первая:" required></br>
                        <input type="text" id="task_2" v-model="task_2" placeholder="Задача вторая:" required></br>
                        <input type="text" id="task_3" v-model="task_3" placeholder="Задача третья:" required></br>
                        <input type="text" id="task_4" v-model="task_4" placeholder="Задача четвертая:"></br>
                        <input type="text" id="task_5" v-model="task_5" placeholder="Задача пятая:"></br>
                     </ul>    
                     <button type="submit" class="btn btn-success">Добавить задачу</button>
                     
                </form>
            </div>
        </div>    
    </div>
        
    </section>
    `,
    data() {
        return {
            title: null,
            task_1: null,
            task_2: null,
            task_3: null,
            task_4: null,
            task_5: null,
            date: null,
            errors: [],
            show: false
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                tasks: [
                    {text: this.task_1, completed: false},
                    {text: this.task_2, completed: false},
                    {text: this.task_3, completed: false},
                    {text: this.task_4, completed: false},
                    {text: this.task_5, completed: false},
                ],
                date: new Date().toLocaleString(),
                status: 0,
                errors: [],
            }
            eventBus.$emit('submitted-cart', card)
            this.title = null
            this.task_1 = null
            this.task_2 = null
            this.task_3 = null
            this.task_4 = null
            this.task_5 = null
            this.closeModal()
        },
        closeModal() {
            this.show = false
        },
        openModal() {
            this.show = true
        }
    },
})

Vue.component('column1', {
    template: `
        <div>
            <h2 class="ColH2">Заметки с < 50% выполнеными задачами</h2>
            <div class="Task" v-for="card in column1">
                <p><b>Заголовок задачи: </br></b>{{ card.title }}</p>
                <ul v-for="task in card.tasks" 
                    v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                    @click="updateStage(task, card)"
                    :disabled="task.completed" focus>
                    {{ task.text }}
                    </li>
                </ul>
                <p id="font"><b>Дата и время создания: </br></b>{{ card.date}}</p>
            </div>
        </div>
    `,
    methods: {
        updateStage(task, card) {
            task.completed = true
            card.status = 0
            let lengths = 0

            for (let i = 0; i < 5; i++) {
                //коолво отметок
                if (card.tasks[i].text != null) {
                    lengths++
                }
            }

            for (let i = 0; i < 5; i++) {
                //перенос
                if (card.tasks[i].completed === true) {
                    card.status++
                }
            }

            if (card.status / lengths * 100 >= 50 && card.status / lengths * 100 < 100) {
                //$emit отправка от дочерки в родитель
                eventBus.$emit('to-column2', card)
            } else if (this.column2.length === 5) {
                this.errors.push('Завершите все задачи в одной из заметок первой колонки')
                if (this.column1.length > 0) {
                    this.column1.forEach(items => {
                        items.tasks.forEach(items => {
                            items.completed = false;
                        })
                    })
                }
            }
        },
    },
    props: {
        column1: {
            type: Array,
        },
        column2: {
            type: Array,
        },
        card: {
            type: Object,
        },
        errors: {
            type: Array,
        },
    },
})

Vue.component('column2', {
    template: `
    <section>
        <div>
            <h2>Заметки с 50% выполнеными задачами</h2>
            <div class="Task" v-for="card in column2">
                <p><b>Заголовок задачи: </br></b>{{ card.title }}</p>
                <ul v-for="task in card.tasks" v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                        @click="updateStage2(task, card)"
                        :anabled="task.completed" focus>
                        {{ task.text }}
                    </li>
                </ul>
                <p id="font"><b>Дата и время создания: </br></b>{{ card.date }}</p>
            </div>
        </div>
    </section>
    `,
    methods: {
        updateStage2(task, card) {
            task.completed = true
            card.status += 1
            let count = 0
            for(let i = 0; i < 5; i++){
                count++
            }
            if (card.status / count * 100 >= 100) {
                eventBus.$emit('to-column3', card)
                card.date = new Date().toLocaleString()
            }
        }
    },
    props: {
        column2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
})

Vue.component('column3', {
    template: `
    <section>
        <div>
            <h2>Выполненные заметки</h2>
            <div class="Task" v-for="card in column3">
                <span><b>Заголовок задачи: </b></br>{{ card.title }}</span></br>
                <ul v-for="task in card.tasks" v-if="task.text != null">
                    <li :class="{ completed:task.completed }">
                        {{ task.text }}
                    </li>
                </ul>
                <span id="font"><b>Дата и время выполненных задач: </b></br>{{ card.date}}</span>
            </div>
        </div>
    </section>
    `,
    computed: {},
    methods: {},
    props: {
        column3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
})

let app = new Vue({
    el: '#app',
    data: {}
})