interface Props {
    title: string;
    message?: string;
    color?: string;
    action?: () => void;
}

export const ResultLayout = ({ title, message, color = 'bg-azul', action }: Props) => (
    <div className={`flex flex-col items-center justify-center h-screen ${color} text-blanco`}>
        <h1 className="text-5xl font-bold">{title}</h1>
        {message && <p className="mt-4 text-lg text-crema">{message}</p>}

        {action && (
            <button
                onClick={action}
                className="mt-6 px-6 py-3 bg-blanco text-azul rounded-lg font-semibold hover:bg-crema"
            >
                Volver
            </button>
        )}
    </div>
);
