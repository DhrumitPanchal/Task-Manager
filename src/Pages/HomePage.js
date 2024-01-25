import { FaPlus } from "react-icons/fa";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../FireBase/Context";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const { user, tasks, getTasks } = useContext(UserContext);
  const navigator = useNavigate();

  useEffect(() => {
    getTasks();
    if (!user) {
      return navigator("/login");
    }
  }, []);

  return (
    <>
      <section className="w-full px-[4rem] max-sm:px-[1.6rem] pt-[1rem] pb-[2rem] bg-[#fbfcfd]">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-[.6rem]">
            <h2 className="text-[1.6rem] font-bold">Daily task</h2>
          </div>
          <Link to={"/card"}>
            <div className="cursor-pointer flex items-center justify-center gap-[.4rem] h-[2.4rem] w-[8rem] rounded-[1.4rem] bg-blue-500/20 text-blue-700">
              <FaPlus className="text-[1.4rem]" />
              <h2>Add task</h2>
            </div>
          </Link>
        </nav>

        <div className="mt-[2rem] flex max-sm:flex-col gap-[4rem] max-sm:gap-[1rem]">
          <div className="w-1/3 max-sm:w-full px-[1.8rem] pb-[1rem] pt-[2rem] rounded-[1.8rem] bg-[#fdf8ea]">
            <h2 className="text-[1.2rem] font-bold text-[#efc34d]">To do</h2>

            <div className="mt-[2rem] flex flex-col gap-[1rem]">
              {tasks
                .filter((e) => e.status === "Todo")
                .map((e) => (
                  <Link key={e.taskID} to={`/UpdateTask/${e.taskID}`}>
                    <div className="cursor-pointer px-[1.4rem] py-[1rem] flex  flex-col gap-[.2rem] rounded-[1.2rem] bg-white">
                      <h2 className="text-[1.1rem] font-medium ">{e.title}</h2>
                      <p className="text-[1rem]">{e.description}</p>
                      <h2 className="text-[1rem] font-medium text-black/70">
                        {e.endingDate}
                      </h2>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="w-1/3 max-sm:w-full px-[1.8rem] pb-[1rem] pt-[2rem] rounded-[1.8rem] bg-[#f0f0ff]">
            <h2 className="text-[1.2rem] font-bold text-[#6060e3]">
              In progress
            </h2>

            <div className="mt-[2rem] flex flex-col gap-[1rem]">
              {tasks
                .filter((e) => e.status === "InProgress")
                .map((e) => (
                  <Link key={e.taskID} to={`/UpdateTask/${e.taskID}`}>
                    <div className="cursor-pointer px-[1.4rem] py-[1rem] flex  flex-col gap-[.2rem] rounded-[1.2rem] bg-white">
                      <h2 className="text-[1.1rem] font-medium ">{e.title}</h2>
                      <p className="text-[1rem]">{e.description}</p>
                      <h2 className="text-[1rem] font-medium text-black/70">
                        {e.endingDate}
                      </h2>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="w-1/3 max-sm:w-full px-[1.8rem] pb-[2rem] pt-[2rem] rounded-[1.8rem] bg-[#fbeef6]">
            <h2 className="text-[1.2rem] font-bold text-[#cf2592]">Done</h2>

            <div className="mt-[2rem] flex flex-col gap-[1rem]">
              {tasks
                .filter((e) => e.status === "Done")
                .map((e) => (
                  <Link key={e.taskID} to={`/UpdateTask/${e.taskID}`}>
                    <div className="cursor-pointer px-[1.4rem] py-[1rem] flex  flex-col gap-[.2rem] rounded-[1.2rem] bg-white">
                      <h2 className="text-[1.1rem] font-medium ">{e.title}</h2>
                      <p className="text-[1rem]">{e.description}</p>
                      <h2 className="text-[1rem] font-medium text-black/70">
                        {e.endingDate}
                      </h2>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
