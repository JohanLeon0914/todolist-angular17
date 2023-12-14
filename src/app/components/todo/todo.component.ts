import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todolist = signal<TodoModel[]>([])

  filter = signal<FilterType>('all')

  todoListFiltered = computed(() => {
    //cuando this.filter o this.todolist() cambia se dispara esta funcion
    const filter = this.filter()
    const todos = this.todolist()

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }

  })

  constructor() {
    effect(() => {
      //cada vez que la señal cambia, se dispara este efecto
      localStorage.setItem('todos', JSON.stringify(this.todolist()))
    })
  }

  ngOnInit() {
    const storage = localStorage.getItem('todos')
    if(storage) {
      this.todolist.set(JSON.parse(storage))
    }
  }

  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
  })

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString)
  }

  addTodo() {
    const newTodoTitle = this.newTodo.value.trim()
    if (this.newTodo.valid && newTodoTitle != "") {
      this.todolist.update((prev_todos) => [
        ...prev_todos,
        {
          id: Date.now(),
          title: newTodoTitle,
          completed: false
        }
      ])
      this.newTodo.reset()
    } else {
      this.newTodo.reset()
      window.alert("La tarea debe tener al menos 3 caracteres y no estar vacia.")
    }
  }

  toggleTodo(todoId: number) {
    this.todolist.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId
          ? { ...todo, completed: !todo.completed }
          : todo;
      })
    );
  }

  removeTodo(todoId: number) {
    this.todolist.update((prev_todos) => prev_todos.filter((todo) => todo.id != todoId))
  }

  updateTodoEditingMode(todoId: number) {
    return this.todolist.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId
          ? { ...todo, editing: true }
          : { ...todo, editing: false };
      })
    )
  }

  saveTitleTodo(todoId: number, event: Event) {
    const title = (event.target as HTMLInputElement).value
    return this.todolist.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId
          ? { ...todo, title: title, editing: false }
          : todo
      })
    )
  }

}
