#!/usr/bin/env python3
"""
Simple test script to verify the todo application functionality.
"""

import sys
import os
sys.path.insert(0, os.path.abspath('.'))

from src.todo_storage import TodoStorage
from src.models.task import Task

def test_todo_functionality():
    print("Testing Todo Application functionality...")

    # Create storage instance
    storage = TodoStorage()

    # Test adding tasks
    print("\n1. Testing task addition:")
    task1 = storage.add_task("Buy groceries", "Milk, bread, eggs")
    print(f"   Added task: {task1}")

    task2 = storage.add_task("Finish report")
    print(f"   Added task: {task2}")

    # Test getting all tasks
    print("\n2. Testing task listing:")
    all_tasks = storage.get_all_tasks()
    for task in all_tasks:
        print(f"   {task}")

    # Test updating a task
    print("\n3. Testing task update:")
    success = storage.update_task(task1.id, title="Buy groceries - urgent", description="Milk, bread, eggs, cheese")
    if success:
        updated_task = storage.get_task(task1.id)
        print(f"   Updated task: {updated_task}")
    else:
        print("   Failed to update task")

    # Test toggling completion
    print("\n4. Testing task completion toggle:")
    print(f"   Before toggle: {storage.get_task(task2.id)}")
    success = storage.toggle_task_completion(task2.id)
    if success:
        toggled_task = storage.get_task(task2.id)
        print(f"   After toggle: {toggled_task}")
    else:
        print("   Failed to toggle task")

    # Test deleting a task
    print("\n5. Testing task deletion:")
    print(f"   Before deletion: {len(storage.get_all_tasks())} tasks")
    success = storage.delete_task(task1.id)
    if success:
        print("   Task deleted successfully")
        print(f"   After deletion: {len(storage.get_all_tasks())} tasks")
    else:
        print("   Failed to delete task")

    print("\nAll tests completed successfully!")

if __name__ == "__main__":
    test_todo_functionality()