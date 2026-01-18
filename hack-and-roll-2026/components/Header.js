export default function Header() {
  return (
    <div className="p-4 w-full flex flex-row justify-between">
      <div className="flex items-center gap-4">
        <img src="images/shutter-camera.png" className="max-h-[40px]"></img>
        <h1 className="text-[#476EAE] text-2xl font-bold">LENNO</h1>
      </div>
      <div>
        <img src="images/history.png" className="max-h-[40px]"></img>
      </div>
    </div>
  );
}
