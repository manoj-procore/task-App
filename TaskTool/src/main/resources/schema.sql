DROP TABLE IF EXISTS task_items, task_comments;

CREATE TABLE task_items (
                            id BIGSERIAL PRIMARY KEY,           -- Auto-incrementing primary key
                            number VARCHAR(255) UNIQUE NOT NULL, -- Task number, unique and not null
                            title VARCHAR(255) NOT NULL,        -- Task title, not null
                            status VARCHAR(255) NOT NULL,       -- Task status, e.g., 'initiated', 'in_progress'
                            assignee VARCHAR(255),              -- Assignee, can be null
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Timestamp of creation, not null, stores timezone info
                            deleted_at TIMESTAMP WITH TIME ZONE, -- Timestamp of soft deletion, null for existance, stores timezone info
                            description TEXT,                   -- Longer text for general description
                            description_rich_text TEXT,         -- Longer text for rich text description
                            due_date TIMESTAMP WITH TIME ZONE,  -- Due date, can be null, stores timezone info
                            updated_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Timestamp of last update, not null, stores timezone info
                            priority VARCHAR(255) NOT NULL      -- Task priority, e.g., 'High', 'Medium'
);

CREATE TABLE task_comments (
                               id BIGSERIAL PRIMARY KEY,           -- Auto-incrementing primary key
                               task_item_id BIGINT REFERENCES task_items(id), -- Corrected foreign key definition
                               created_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Timestamp of creation, not null, stores timezone info
                               updated_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Timestamp of last update, not null, stores timezone info
                               user_name VARCHAR(255),              -- Assignee, can be null
                               comment TEXT                   -- Removed trailing comma
);