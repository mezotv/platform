
import { auth } from "@/auth";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


const CourseInfoLayout = async ({
    params
} : {
    params: { courseId: string;  };
}) => {
    const session  = await auth();
    if (!session) {
        return redirect("/")
    }
    const course = await db.course.findUnique({
        where: {
          id: params.courseId,
        },
        include: {
          chapters: {
            where: {
              isPublished: true,
            },
            include: {
              userProgress: {
                where: {
                  userId: session.user.id ?? '',
                },
              }
            },
            
            orderBy: {
              position: "asc"
            }
          },
        },
      });
    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id ?? '',
                courseId: params.courseId
            }
        }
    });
    
    return (
        <div className="pt-40 mx-5 md:mx-20 pb-40 space-y-20 landing">
          <div className="text-center pb-8">
            <h1 className="text-6xl font-extrabold mb-3">{course?.title}</h1>
            <p className="text-sm opacity-50 font-medium ">{course?.description}</p>
            <div className="flex items-center justify-center">
                <Separator className="mt-8 bg-slate-100/20 h-0.5 w-40 mb-8" />
            </div>
            
            <div className="flex items-center justify-center">
              <iframe 
              src={`${course?.introVideo}`} 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
              title="Video"
              className="aspect-video w-[700px]"
              ></iframe>
            </div>
        
            <div className='flex-1 flex flex-col items-center justify-center mb-4 mt-8'>
              <Link
                className="w-50 justify-center flex items-center whitespace-nowrap transition duration-150 ease-in-out font-medium rounded px-4 py-1.5  text-zinc-900 bg-gradient-to-r from-white/80 via-white to-white/80 hover:bg-white group mt-4 mb-4"
                href={`/course/${course?.id}`}
              >
                Go To Course{" "}
                <ArrowRight className="w-3 h-3 tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1" />
              </Link>
            </div>
          </div>

          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold ">What will I build?</h1>
            <p className="font-medium text-slate-100/70 pt-4">{course?.description2}</p>           
          </div>

          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold">What will I learn?</h1>
            <p className="font-medium text-slate-100/70 pt-4 whitespace-pre-wrap">{course?.learningOutcome}</p> 
          </div>

          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold">What's included?</h1>
            <p className="font-medium text-slate-100/70 pt-4 whitespace-pre-wrap">{course?.included}</p>
          </div>

          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold">Difficulty level</h1>
            <p className="font-medium text-slate-100/80 mt-4 p-2 border border-slate-100/30 rounded-[5px] bg-zinc-900 whitespace-pre-wrap">{course?.difficulty}</p>
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold">Purchase course</h1>
            {
              !course?.price
              ? <p className="pt-5">This course is free!</p>
              : <button className="inline-flex h-20 animate-shimmer items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 rounded-[5px]">
              Purchase course for ${course?.price}
            </button>
            }
          </div>

          

        

          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <h1 className="text-center text-5xl font-bold my-8">Chapters</h1>
              <div className="flex items-center justify-center">
                <Separator className=" bg-slate-100/20 h-0.5 w-40 mb-12" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {course?.chapters.map((chapter, index) => (
                  <Link href={`/course/${course?.id}/chapter/${chapter.id}`} key={chapter.id}>
                    <div className="bg-zinc-900 shadow-lg shadow-black/50 rounded-[5px]  w-full p-6  flex flex-col hover:bg-opacity-80 transition duration-300 ease-in-out">
                      <div className="flex">
                        <h2 className="text-2xl font-bold text-white mb-4"><span className="mr-2 font-extrabold text-2xl opacity-40">{index + 1 <= 9 ? `0${index +  1}` : index + 1}</span>{chapter.title}</h2>
                      </div>
                      <p className="opacity-50 flex">{chapter.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
    )
}

export default CourseInfoLayout