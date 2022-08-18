import styles from './style.module.css';
import {Clipboard, PlusCircle, Trash} from 'phosphor-react';
import { ChangeEvent, useEffect, useState } from 'react';
import {api} from '../../services/api'
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

interface Tasks {
  content: string;
  completed: boolean;
  id: number;
}

export function ToDo(){
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [newTask, setNewTask] = useState('');

  const total = tasks.reduce((acc, task) => {
    acc.criadas += 1;

    if(task.completed === true){
      acc.concluidas += 1;
    }

    return acc;
  }, {
    concluidas: 0,
    criadas: 0,
  });

  useEffect( () => {
     (
      async () => {
        const response = await api.get('/tasks').then((response: AxiosResponse) => {
          setTasks(response.data);
        });
      }
    )();
  }, []);


  const handleCreateTask = async () => {

    if(newTask === ''){
      toast.error('Ops... a tarefa não foi informada!!');
      return;
    }

    const response = await toast.promise(
      api.post('/tasks', {
        content: newTask, completed: false
      }),
      {
        pending: 'Aguarde enquanto carregamos...',
        success: 'Sucesso!! 👌',
        error: 'Erro ao salvar 🤯'
      }
    )

    setTasks([...tasks, response.data]);
    setNewTask('');

  }

  const handleCheckedTasks = async (task: Tasks) => {
    
    const response = await toast.promise(
      api.put(`/tasks/${task.id}`, {
        content: task.content, completed: !task.completed, id: task.id
      }),
      {
        pending: 'Aguarde enquanto carregamos...',
        success: 'Alterado com sucesso!! 👌',
        error: 'Erro ao salvar 🤯'
      }
    )

    const removeTasks = tasks.filter(t => task.id !== t.id)
    task.completed = !task.completed;

    setTasks([...removeTasks, task]);
  }

  const handleRemoveTasks = async (task: Tasks) => {
    await toast.promise(
      api.delete(`/tasks/${task.id}`),
      {
        pending: 'Aguarde enquanto carregamos...',
        success: 'Deletado com sucesso!! 👌',
        error: 'Erro ao salvar 🤯'
      }
    )
    const removeTasks = tasks.filter(t => task.id !== t.id)

    setTasks([...removeTasks]);

  }

  return (
    <div className={styles.container}>
      <div className={styles.boxInput}>
        <input type="text" placeholder='Adione uma tarefa' onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}/>
       <button
          type="button"
          onClick={handleCreateTask}
        >
          Criar
          <PlusCircle size={16}/>
        </button>
      </div>

      <div className={styles.boxTasks}>
        <div className={styles.header}>
          <div className={styles.criadas}>
            Tarefas Criadas <span>{total.criadas}</span>
          </div>
          <div className={styles.concluidas}>
            Concluídas <span>{`${total.concluidas} de ${total.criadas}`}</span>
          </div>
        </div>

        <div>
          <div className={styles.listTasks}>

            {
              tasks.length > 0 ? (
                tasks.map((tasks) => (
                  <div key={tasks.id} className={styles.listTasksItem}>
                    <input type="checkbox" checked={tasks.completed} onClick={() => handleCheckedTasks(tasks)} name={`task-${tasks.id}`} id={`task-${tasks.id}`}/>
                    <p className={tasks.completed ? `${styles.completedItem}` : ''}>{tasks.content}</p>
                    <button type="button" onClick={() => handleRemoveTasks(tasks)}>
                      <Trash size={24} />
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.listTasksEmpty}>
                  <Clipboard size={56} />
                  <span>Você ainda não possui tarefas cadastradas</span>
                  <p>C rie tarefas e organize seus itens a fazer</p>
                </div>
              )
            }

          </div>
        </div>
      </div>
    </div>
  );
}