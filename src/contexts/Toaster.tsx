import { Toast } from "flowbite-react";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export type ToastContextType = {
  addToast: (content: ReactNode, state: ToastState, classname?: string) => void;
};

export const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export enum ToastState {
  Success = "success",
  Error = "error",
  Info = "info",
}

export const useToaster = () => {
  const cntx = useContext(ToastContext);

  return cntx;
};

type ToastDescription = { id: string; state: ToastState; content: ReactNode };

interface ToasterProps {
  toasts: ToastDescription[];
  setToasts: Dispatch<SetStateAction<ToastDescription[]>>;
}

const Toaster: FC<ToasterProps> = ({ toasts, setToasts }) => (
  <div className={"fixed bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"}>
    {toasts.map((item) => (
      <Toast key={item.id}>
        {item.state === ToastState.Success && (
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="size-6" />
          </div>
        )}
        {item.state === ToastState.Error && (
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="size-6" />
          </div>
        )}
        {item.state === ToastState.Info && (
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
            <HiExclamation className="size-6" />
          </div>
        )}
        <div className="mx-2">{item.content}</div>
        <Toast.Toggle onClick={() => setToasts((prev) => prev.filter((currentToast) => currentToast.id !== item.id))} />
      </Toast>
    ))}
  </div>
);

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastDescription[]>([]);

  const addToast = useCallback((content: ReactNode, state: ToastState) => {
    setToasts((prev) => [{ id: Math.random().toString(32).replace(".", ""), content, state }, ...prev]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <Toaster toasts={toasts} setToasts={setToasts} />
    </ToastContext.Provider>
  );
};