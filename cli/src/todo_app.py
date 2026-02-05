"""
Console-based todo application.

This module implements a simple command-line todo application with the following features:
- Add new tasks
- List all tasks
- Update existing tasks
- Delete tasks
- Toggle task completion status
"""

import sys
from typing import Optional
from src.todo_storage import TodoStorage
from src.models.task import Task


def main():
    """Main entry point for the todo application."""
    print("Welcome to the Console-Based Todo Application!")

    storage = TodoStorage()

    while True:
        print("\n--- Todo Application Menu ---")
        print("1. Add new task")
        print("2. List all tasks")
        print("3. Update task")
        print("4. Delete task")
        print("5. Toggle complete/incomplete")
        print("6. Quit")

        try:
            choice = input("\nEnter your choice (1-6): ").strip()

            if choice == "1":
                add_task(storage)
            elif choice == "2":
                list_tasks(storage)
            elif choice == "3":
                update_task(storage)
            elif choice == "4":
                delete_task(storage)
            elif choice == "5":
                toggle_task_status(storage)
            elif choice == "6":
                print("Thank you for using the Todo Application. Goodbye!")
                sys.exit(0)
            else:
                print("Invalid choice. Please enter a number between 1 and 6.")
        except KeyboardInterrupt:
            print("\n\nApplication interrupted. Goodbye!")
            sys.exit(0)
        except Exception as e:
            print(f"An error occurred: {e}")


def add_task(storage: TodoStorage):
    """Add a new task to the storage."""
    print("\n--- Add New Task ---")

    title = input("Enter task title (required): ").strip()
    if not title:
        print("Error: Task title cannot be empty.")
        return

    description = input("Enter task description (optional, press Enter to skip): ").strip()

    try:
        task = storage.add_task(title, description if description else "")
        print(f"Task added successfully!\n{task}")
    except ValueError as e:
        print(f"Error: {e}")


def list_tasks(storage: TodoStorage):
    """Display all tasks in the storage."""
    print("\n--- All Tasks ---")

    tasks = storage.get_all_tasks()

    if not tasks:
        print("No tasks yet. Add a task to get started!")
        return

    for task in tasks:
        print(task)


def update_task(storage: TodoStorage):
    """Update an existing task."""
    print("\n--- Update Task ---")

    try:
        task_id_input = input("Enter task ID to update: ").strip()
        if not task_id_input:
            print("Error: Task ID cannot be empty.")
            return

        task_id = int(task_id_input)

        # Check if task exists
        task = storage.get_task(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found.")
            return

        print(f"Current task: {task}")

        new_title = input(f"Enter new title (current: '{task.title}', press Enter to keep current): ").strip()
        new_description = input(f"Enter new description (current: '{task.description}', press Enter to keep current): ").strip()

        # Prepare update parameters
        title_update = new_title if new_title else None
        description_update = new_description if new_description else None

        # If user pressed Enter without typing anything, don't update that field
        if new_title == "":
            title_update = task.title  # Keep current title
        if new_description == "":
            description_update = task.description  # Keep current description

        try:
            success = storage.update_task(task_id, title_update, description_update)
            if success:
                updated_task = storage.get_task(task_id)
                print(f"Task updated successfully!\n{updated_task}")
            else:
                print("Failed to update task.")
        except ValueError as e:
            print(f"Error: {e}")

    except ValueError:
        print("Error: Please enter a valid task ID (a number).")


def delete_task(storage: TodoStorage):
    """Delete a task from storage."""
    print("\n--- Delete Task ---")

    try:
        task_id_input = input("Enter task ID to delete: ").strip()
        if not task_id_input:
            print("Error: Task ID cannot be empty.")
            return

        task_id = int(task_id_input)

        # Check if task exists
        task = storage.get_task(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found.")
            return

        print(f"You are about to delete this task:\n{task}")

        confirm = input("Are you sure you want to delete this task? (y/N): ").strip().lower()

        if confirm in ['y', 'yes']:
            success = storage.delete_task(task_id)
            if success:
                print("Task deleted successfully!")
            else:
                print("Failed to delete task.")
        else:
            print("Task deletion cancelled.")

    except ValueError:
        print("Error: Please enter a valid task ID (a number).")


def toggle_task_status(storage: TodoStorage):
    """Toggle the completion status of a task."""
    print("\n--- Toggle Task Status ---")

    try:
        task_id_input = input("Enter task ID to toggle: ").strip()
        if not task_id_input:
            print("Error: Task ID cannot be empty.")
            return

        task_id = int(task_id_input)

        # Check if task exists
        task = storage.get_task(task_id)
        if not task:
            print(f"Error: Task with ID {task_id} not found.")
            return

        print(f"Current task: {task}")

        success = storage.toggle_task_completion(task_id)
        if success:
            updated_task = storage.get_task(task_id)
            print(f"Task status updated!\n{updated_task}")
        else:
            print("Failed to update task status.")

    except ValueError:
        print("Error: Please enter a valid task ID (a number).")


if __name__ == "__main__":
    main()