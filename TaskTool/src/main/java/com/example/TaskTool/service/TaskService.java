package com.example.TaskTool.service;

import com.example.TaskTool.model.Comment;
import com.example.TaskTool.model.Task;
import com.example.TaskTool.repository.CommentRepository;
import com.example.TaskTool.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // Import Collectors

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CommentRepository commentRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll().stream()
                .filter(task -> task.getDeletedAt() == null) // Filter out soft-deleted tasks
                .collect(Collectors.toList());
    }

    public Task save(Task task) {
        task.setCreatedAt(OffsetDateTime.now());
        task.setUpdatedAt(OffsetDateTime.now());
        // Ensure deletedAt is null for new tasks
        task.setDeletedAt(null);
        return taskRepository.save(task);
    }

    public Optional<Task> getById(Long id) {
        return taskRepository.findById(id)
                .filter(task -> task.getDeletedAt() == null); // Filter out soft-deleted tasks
    }

    public Task updateTask(Long id, Task task) {
        Optional<Task> existingTaskOptional = taskRepository.findById(id);
        if (existingTaskOptional.isEmpty() || existingTaskOptional.get().getDeletedAt() != null) {
            // Task not found or is soft-deleted
            return null;
        }

        Task t = existingTaskOptional.get();

        // Update fields only if they are not null or empty in the incoming task
        if (task.getDescription() != null) { // Allow setting to empty string if intended
            t.setDescription(task.getDescription());
        }
        if (task.getNumber() != null) {
            t.setNumber(task.getNumber());
        }
        if (task.getAssignee() != null) {
            t.setAssignee(task.getAssignee());
        }
        if (task.getDescriptionRichText() != null) {
            t.setDescriptionRichText(task.getDescriptionRichText());
        }
        if (task.getTitle() != null) {
            t.setTitle(task.getTitle());
        }
        if (task.getDueDate() != null) {
            t.setDueDate(task.getDueDate());
        }
        if (task.getPriority() != null) {
            t.setPriority(task.getPriority());
        }

        if(task.getStatus() != null) {
            t.setStatus(task.getStatus());
        }

        t.setUpdatedAt(OffsetDateTime.now());
        return taskRepository.save(t);
    }

    public Boolean deleteTask(Long id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent() && taskOptional.get().getDeletedAt() == null) {
            Task t = taskOptional.get();
            t.setDeletedAt(OffsetDateTime.now()); // Soft delete
            taskRepository.save(t); // Save the updated task
            return true;
        }
        return false;
    }

    public Boolean addComment(Comment comment) {
        // Before adding a comment, ensure the parent task is not soft-deleted
        Optional<Task> taskOptional = taskRepository.findById(comment.getTaskItemId());
        if (taskOptional.isEmpty() || taskOptional.get().getDeletedAt() != null) {
            return false; // Task not found or is soft-deleted, cannot add comment
        }
        comment.setCreatedAt(OffsetDateTime.now());
        comment.setUpdatedAt(OffsetDateTime.now());
        commentRepository.save(comment);
        return true;
    }

    public List<Comment> getComments(Long taskId) {
        // Ensure that we only retrieve comments for tasks that are not soft-deleted
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isEmpty() || taskOptional.get().getDeletedAt() != null) {
            return null; // Task not found or is soft-deleted, no comments to retrieve
        }
        return commentRepository.findByTaskItemId(taskId);
    }
}