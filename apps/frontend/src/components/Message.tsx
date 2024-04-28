interface props {
  message: string,
}

export default function Message({ message }: props) {
  return (
    <div className="flex">
      <div className="m-2 h-10 w-10 bg-slate-200 rounded-full">
      </div>
      <div className="font-mono bg-slate-400 m-2 rounded p-2 max-w-3xl break-words">
        {message}
      </div>
    </div>
  )
}
