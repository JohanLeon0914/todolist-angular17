import { Component, signal } from '@angular/core';
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
export class TodoComponent {
  todolist = signal<TodoModel[]>([
    {
      id: 1,
      title: "ejemplo",
      completed: false,
      editing: false
    },
    {
      id: 2,
      title: "ejemplo 2",
      completed: true,
      editing: false
    },
    {
      id: 3,
      title: "ejemplo 3",
      completed: false,
      editing: false
    },
  ])

  filter = signal<FilterType>('all')

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

}
