package com.example.TaskTool.controller;

import com.example.TaskTool.model.Comment;
import com.example.TaskTool.model.Task;
import com.example.TaskTool.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server port
@RestController
@RequestMapping("/rest/v1/task_items")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Operation(summary = "Get all tasks", description = "Retrieves a list of all tasks in the system.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)))
    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @Operation(summary = "Create a new task", description = "Adds a new task to the system.")
    @ApiResponse(responseCode = "201", description = "Task created successfully")
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }


    @Operation(summary = "Get task by ID", description = "Retrieves a specific task by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the task",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "404", description = "Task not found", content = @Content)
    })
    @GetMapping("/task/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Update an existing task", description = "Updates the details of a task by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "404", description = "Task not found", content = @Content)
    })
    @PutMapping("/task/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task updated = taskService.updateTask(id, task);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Delete a task", description = "Removes a task from the system by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Task deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found", content = @Content)
    })
    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Add a comment to a task", description = "Adds a new comment to a specified task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comment added successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found", content = @Content)
    })
    @PostMapping("/{taskId}/comment")
    public ResponseEntity<Void> addComment(@PathVariable Long taskId, @RequestBody Comment comment) {
        comment.setTaskItemId(taskId);
        boolean success = taskService.addComment(comment);
        return success ? ResponseEntity.status(HttpStatus.CREATED).build() : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get all comments of task", description = "Gets all comments for a specified task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved comments",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Comment.class))),
            @ApiResponse(responseCode = "404", description = "Task not found", content = @Content)
    })
    @GetMapping("/{taskId}/comment")
    public ResponseEntity<List<Comment>> getTaskComments(@PathVariable Long taskId) {
        List<Comment> comments = taskService.getComments(taskId);
        return comments != null ? ResponseEntity.ok(comments) : ResponseEntity.notFound().build();
    }

}
