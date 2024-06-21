import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient();
  const { mutate: updateTodoHandler, isPending: updating } = useMutation({
    mutationKey: ["update-todo"],
    mutationFn: async () => {
      if (todo.completed) {
        alert("Todo is already completed");
      }
      try {
        const res = await fetch(`${BASE_URL}/todos/${todo._id}`, {
          method: "PATCH",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Some error occured while updating the todo");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-todo"],
    mutationFn: async () => {
      try {
        const res = await fetch(`${BASE_URL}/todos/${todo._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Error while deleting the todo");
        }
        return data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (e: any) => {
      alert(e.message);
    },
  });

  return (
    <Flex gap={2} alignItems={"center"}>
      <Flex
        flex={1}
        alignItems={"center"}
        border={"1px"}
        borderColor={"gray.600"}
        p={2}
        borderRadius={"lg"}
        justifyContent={"space-between"}
      >
        <Text
          color={todo.completed ? "green.200" : "yellow.100"}
          textDecoration={todo.completed ? "line-through" : "none"}
        >
          {todo.body}
        </Text>
        {todo.completed && (
          <Badge ml="1" colorScheme="green">
            Done
          </Badge>
        )}
        {!todo.completed && (
          <Badge ml="1" colorScheme="yellow">
            In Progress
          </Badge>
        )}
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Box
          onClick={() => updateTodoHandler()}
          color={"green.500"}
          cursor={"pointer"}
        >
          {!updating ? <FaCheckCircle size={20} /> : <Spinner size={"sm"} />}
        </Box>
        <Box onClick={() => deleteTodo()} color={"red.500"} cursor={"pointer"}>
          {!isDeleting ? <MdDelete size={25} /> : <Spinner size={"sm"} />}
        </Box>
      </Flex>
    </Flex>
  );
};
export default TodoItem;
