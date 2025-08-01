package com.example.TaskTool.repository;
import com.example.TaskTool.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findByTaskItemId(Long taskItemId);
}
