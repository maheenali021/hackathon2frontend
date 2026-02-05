"""
Task data model for the console-based todo application.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class Task:
    """
    Represents a single todo item that can be managed by the application.

    Attributes:
        id: Unique identifier for the task
        title: The title or name of the task (required)
        description: Additional details about the task (optional)
        completed: Boolean indicating whether the task is completed (defaults to False)
    """
    id: int
    title: str
    description: Optional[str] = ""
    completed: bool = False

    def __str__(self) -> str:
        """Return a string representation of the task."""
        status = "[DONE]" if self.completed else "[PENDING]"
        desc = f"\n   Description: {self.description}" if self.description else ""
        return f"ID: {self.id} | {status} | Title: {self.title}{desc}"