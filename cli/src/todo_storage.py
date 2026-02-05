"""
In-memory storage for the console-based todo application.
"""

from typing import Dict, List, Optional
from src.models.task import Task


class TodoStorage:
    """
    Manages in-memory storage of tasks using a dictionary keyed by task ID.
    """

    def __init__(self):
        self._tasks: Dict[int, Task] = {}
        self._next_id: int = 1

    def add_task(self, title: str, description: Optional[str] = "") -> Task:
        """
        Add a new task to storage.

        Args:
            title: The title of the task (required)
            description: The description of the task (optional)

        Returns:
            The newly created Task object
        """
        if not title.strip():
            raise ValueError("Task title cannot be empty")

        task = Task(
            id=self._next_id,
            title=title.strip(),
            description=description.strip() if description else "",
            completed=False
        )

        self._tasks[self._next_id] = task
        self._next_id += 1

        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """
        Retrieve a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task object if found, None otherwise
        """
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        """
        Retrieve all tasks.

        Returns:
            A list of all Task objects
        """
        return list(self._tasks.values())

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """
        Update an existing task.

        Args:
            task_id: The ID of the task to update
            title: New title for the task (optional)
            description: New description for the task (optional)

        Returns:
            True if the task was updated, False if the task was not found
        """
        if task_id not in self._tasks:
            return False

        task = self._tasks[task_id]

        if title is not None:
            if title.strip():
                task.title = title.strip()
            else:
                raise ValueError("Task title cannot be empty")

        if description is not None:
            task.description = description.strip() if description else ""

        return True

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if the task was deleted, False if the task was not found
        """
        if task_id not in self._tasks:
            return False

        del self._tasks[task_id]
        return True

    def toggle_task_completion(self, task_id: int) -> bool:
        """
        Toggle the completion status of a task.

        Args:
            task_id: The ID of the task to toggle

        Returns:
            True if the task status was toggled, False if the task was not found
        """
        if task_id not in self._tasks:
            return False

        task = self._tasks[task_id]
        task.completed = not task.completed
        return True

    def get_next_id(self) -> int:
        """
        Get the next available task ID.

        Returns:
            The next available task ID
        """
        return self._next_id