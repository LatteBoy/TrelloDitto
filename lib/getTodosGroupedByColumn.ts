import { databases } from "@/appwrite"
import { TypedColumn, Column, Board } from "@/typings";

export const getTodosGroupedByColumn = async() => {
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    );

    // set todos to our entire response from AppWrite [{...}, {...}]
    const todos = data.documents;

    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }

        const columnEntry = acc.get(todo.status)!;

        // Push a new todo object into the todos array of the current column
        columnEntry.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            // get the image if it exists on the todo
            ...(todo.image && { image: JSON.parse(todo.image) })
        });

        return acc;
    }, new Map<TypedColumn, Column>)
    
    
    // if columns doesn't have inProgress, Todo and Done, add them with empty Todos
    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: [],
            });
        }
    }

    // sort columns by columnType (always in order of "todo", "inprogress", "done")
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    );

    const board: Board = {
        columns: sortedColumns
    }

    return board;
};