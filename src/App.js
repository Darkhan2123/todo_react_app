import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const taskTitle = useRef("");
  const taskSummary = useRef("");
  const [taskState, setTaskState] = useState("Not done");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [editOpened, setEditOpened] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editState, setEditState] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  useEffect(() => {
    loadTasks();
  }, []);

  function createTask() {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState,
      deadline: taskDeadline,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    taskTitle.current.value = "";
    taskSummary.current.value = "";
    setTaskState("Not done");
    setTaskDeadline("");
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function sortTasks(state) {
    const sorted = [...tasks].sort((a, b) => {
      if (a.state === state) return -1;
      if (b.state === state) return 1;
      return 0;
    });
    setTasks(sorted);
    saveTasks(sorted);
  }

  function filterTasks(state) {
    const loadedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filtered = loadedTasks.filter((task) => task.state === state);
    setTasks(filtered);
  }

  function sortByDeadline() {
    const sorted = [...tasks].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    setTasks(sorted);
    saveTasks(sorted);
  }

  function saveEditedTask() {
    const updatedTasks = [...tasks];
    updatedTasks[currentTaskIndex] = {
      title: editTitle,
      summary: editSummary,
      state: editState,
      deadline: editDeadline,
    };
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditOpened(false);
  }

  function loadTasks() {
    let loadedTasks = localStorage.getItem("tasks");
    let parsedTasks = JSON.parse(loadedTasks);
    if (parsedTasks) {
      setTasks(parsedTasks);
    }
  }

  function saveTasks(tasksToSave) {
    localStorage.setItem("tasks", JSON.stringify(tasksToSave));
  }

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select
              mt={"md"}
              data={[
                { value: "Done", label: "Done" },
                { value: "Not done", label: "Not done" },
                { value: "Doing right now", label: "Doing right now" },
              ]}
              placeholder="Select task state"
              label="State"
              required
              value={taskState}
              onChange={(value) => setTaskState(value)}
            />
            <TextInput
              mt={"md"}
              type="date"
              placeholder="Pick a deadline"
              label="Deadline"
              value={taskDeadline}
              onChange={(event) => setTaskDeadline(event.currentTarget.value)}
            />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>

          <Modal
            opened={editOpened}
            size={"md"}
            title={"Edit Task"}
            withCloseButton={false}
            onClose={() => {
              setEditOpened(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select
              mt={"md"}
              data={[
                { value: "Done", label: "Done" },
                { value: "Not done", label: "Not done" },
                { value: "Doing right now", label: "Doing right now" },
              ]}
              placeholder="Select task state"
              label="State"
              required
              value={editState}
              onChange={(value) => setEditState(value)}
            />
            <TextInput
              mt={"md"}
              type="date"
              placeholder="Pick a deadline"
              label="Deadline"
              value={editDeadline}
              onChange={(event) => setEditDeadline(event.currentTarget.value)}
            />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setEditOpened(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  saveEditedTask();
                }}
              >
                Save Changes
              </Button>
            </Group>
          </Modal>

          <Container size={800} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
              </ActionIcon>
            </Group>

            <Group mt="md" position="apart" spacing="xs" wrap="wrap">
              <Button onClick={() => sortTasks("Done")}>Show 'Done' First</Button>
              <Button onClick={() => sortTasks("Doing right now")}>Show 'Doing' First</Button>
              <Button onClick={() => sortTasks("Not done")}>Show 'Not done' First</Button>
              <Button onClick={() => filterTasks("Done")} variant="outline">
                Show only 'Done'
              </Button>
              <Button onClick={() => filterTasks("Not done")} variant="outline">
                Show only 'Not done'
              </Button>
              <Button onClick={() => filterTasks("Doing right now")} variant="outline">
                Show only 'Doing'
              </Button>
              <Button onClick={sortByDeadline}>Sort by Deadline</Button>
            </Group>

            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (task.title) {
                  return (
                    <Card withBorder key={index} mt={"sm"}>
                      <Group position={"apart"}>
                        <Text weight={"bold"}>{task.title}</Text>
                        <Group spacing="xs">
                          <ActionIcon
                            onClick={() => {
                              setCurrentTaskIndex(index);
                              setEditTitle(task.title);
                              setEditSummary(task.summary);
                              setEditState(task.state);
                              setEditDeadline(task.deadline);
                              setEditOpened(true);
                            }}
                            color={"blue"}
                            variant={"transparent"}
                          >
                            <Edit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => {
                              deleteTask(index);
                            }}
                            color={"red"}
                            variant={"transparent"}
                          >
                            <Trash size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>
                        {task.summary
                          ? task.summary
                          : "No summary was provided for this task"}
                      </Text>
                      <Text color={"dimmed"} size={"sm"} mt={"sm"}>
                        State: {task.state}
                      </Text>
                      {task.deadline && (
                        <Text color={"dimmed"} size={"sm"}>
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </Text>
                      )}
                    </Card>
                  );
                }
                return null;
              })
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}

            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
