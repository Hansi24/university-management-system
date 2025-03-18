import { useForm } from "react-hook-form";
// import SideBar from "../../layout/SideBar";
// import TitleBar from "../../layout/TitleBar";
import { useState, useEffect, useContext } from "react";
import { ICourse, IModule } from "../../../../models/Course";
import { IResource } from "../../../../models/Resource";
import { CourseService } from "../../../../service/courseService";
import { AppResponse } from "../../../../models/Response";
import { CommonContext } from "../../../../context/commonContext";
import { useMessagePopup } from "../../../../context/useMessagePopup";
import { ResourceService } from "../../../../service/resourceService";
import { AuthService } from "../../../../service/authService";
import { IRegisterFormData, IUsers } from "../../../../models/RegistraionFormData";
import { AdminType } from '../../../../enums/roleEnums';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "1:00 - 2:00",
  "2:00 - 3:00",
  "3:00 - 4:00",
];

const TimeTable = () => {
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  const [lecturers, setLecturers] = useState<IUsers[]>([]);
  const [filteredLecturers, setFilteredLecturers] = useState<{ [key: string]: IUsers[] }>({});
  const [timetable, setTimetable] = useState<any>(null);

  const selectedCourseId = watch("courseId");
  const selectedSemester = watch("semester");
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();
  const userRole = localStorage.getItem("userRole");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchCourses = async () => {
      setSpinnerOpen(true);
      try {
        const response: AppResponse<ICourse[]> =
          await CourseService.getAllCourse();
        if (response.success) {
          showSuccessMessage("Course fetched successfully");
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setSpinnerOpen(false);
      }
    };

    const fetchResource = async () => {
      setSpinnerOpen(true);
      try {
        const response: AppResponse<IResource[]> =
          await ResourceService.getAllClassroomResource();
        if (response.success) {
          showSuccessMessage("Resource fetched successfully");
          setResources(response.data);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setSpinnerOpen(false);
      }
    };

    const fetchLecturers = async () => {
      setSpinnerOpen(true);
      try {
        const response: AppResponse<IUsers[]> =
          await AuthService.getUsersByUserRole();
        if (response.success) {
          showSuccessMessage("Lecturers fetched successfully");
          setLecturers(response.data);
          // Initialize filtered lecturers for all time slots
          const initialFilteredLecturers: { [key: string]: IUsers[] } = {};
          DAYS.forEach((day) => {
            TIME_SLOTS.forEach((_, timeIndex) => {
              initialFilteredLecturers[`${timeIndex}-${day}`] = response.data;
            });
          });
          setFilteredLecturers(initialFilteredLecturers);
        }
      } catch (error) {
        console.error("Error fetching lecturers:", error);
      } finally {
        setSpinnerOpen(false);
      }
    };

    fetchCourses();
    // if (userType === AdminType.ACADEMIC) {
      fetchResource();
      fetchLecturers();
    // }
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      const selectedCourse = courses.find(
        (course) => course._id === selectedCourseId
      );
      if (selectedCourse) {
        setModules(
          selectedCourse.semesters.find(
            (s) => s.semesterNumber === Number(selectedSemester)
          )?.modules || []
        );

        // Reset all dropdowns for all time slots
        DAYS.forEach((day) => {
          TIME_SLOTS.forEach((_, timeIndex) => {
            setValue(`${timeIndex}-${day}-module`, ""); // Reset module
            setValue(`${timeIndex}-${day}-location`, ""); // Reset classroom
            setValue(`${timeIndex}-${day}-lecturer`, ""); // Reset lecturer
          });
        });

        // Reset filtered lecturers for all time slots
        const initialFilteredLecturers: { [key: string]: IUsers[] } = {};
        DAYS.forEach((day) => {
          TIME_SLOTS.forEach((_, timeIndex) => {
            initialFilteredLecturers[`${timeIndex}-${day}`] = lecturers;
          });
        });
        setFilteredLecturers(initialFilteredLecturers);
      }
    }
  }, [selectedCourseId, selectedSemester, courses]);

  // Fetch timetable when course or semester changes
  useEffect(() => {
    if (selectedCourseId && selectedSemester) {
      fetchTimetable(selectedCourseId, selectedSemester);
    }
  }, [selectedCourseId, selectedSemester]);

  const fetchTimetable = async (courseId: string, semester: number) => {
    setSpinnerOpen(true);
    try {
      const response: AppResponse<any> = await CourseService.getTimetable(
        courseId,
        semester
      );
      if (response.success) {
        setTimetable(response.data);
        populateForm(response.data);
        showSuccessMessage("Timetable fetched successfully");
      } else {
        setTimetable(null);
        reset({
          courseId: selectedCourseId,
          semester: selectedSemester,
        });
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setTimetable(null);
      reset({
        courseId: selectedCourseId,
        semester: selectedSemester,
      });
      showErrorMessage("Failed to fetch timetable");
    } finally {
      setSpinnerOpen(false);
    }
  };

  const populateForm = (timetableData: any) => {
    DAYS.forEach((day) => {
      TIME_SLOTS.forEach((timeSlot, timeIndex) => {
        const slotData = timetableData.days[day]?.find(
          (slot: any) => slot.timeSlot === timeSlot
        );
        if (slotData) {
          setValue(`${timeIndex}-${day}-module`, slotData.moduleId);
          setValue(`${timeIndex}-${day}-location`, slotData.location);
          setValue(`${timeIndex}-${day}-lecturer`, slotData.lecturerId);
          console.log(slotData);
        }
      });
    });
  };

  const handleModuleChange = (timeIndex: number, day: string, moduleId: string) => {
    setValue(`${timeIndex}-${day}-lecturer`, ""); // Reset the lecturer when module changes

    if (moduleId) {
      const filtered = lecturers.filter(
        (lecturer) =>
          lecturer.teachingModules &&
          lecturer.teachingModules.includes(moduleId)
      );
      setFilteredLecturers((prev) => ({
        ...prev,
        [`${timeIndex}-${day}`]: filtered, // Update filtered lecturers for this specific time slot
      }));
    } else {
      setFilteredLecturers((prev) => ({
        ...prev,
        [`${timeIndex}-${day}`]: lecturers, // Reset to all lecturers if no module is selected
      }));
    }
  };

  const onSubmit = async (data: any) => {
    const formattedSchedule: any = {
      courseId: selectedCourseId,
      semester: Number(selectedSemester),
      days: {} as any,
    };

    DAYS.forEach((day) => {
      formattedSchedule.days[day] = TIME_SLOTS.map((timeSlot, timeIndex) => {
        const module = data[`${timeIndex}-${day}-module`];
        const location = data[`${timeIndex}-${day}-location`];
        const lecturer = data[`${timeIndex}-${day}-lecturer`];

        return module && location && lecturer
          ? {
              timeSlot,
              moduleId: module,
              lecturerId: lecturer,
              location: location,
            }
          : null;
      }).filter(Boolean);
    });

    console.log("Formatted Schedule for Submission:", formattedSchedule);

    if (timetable) {
      // Update existing timetable
      setSpinnerOpen(true);
      try {
        const response: AppResponse<any> = await CourseService.updateTimetable(
          selectedCourseId,
          selectedSemester,
          formattedSchedule
        );
        if (response.success) {
          setTimetable(response.data);
          populateForm(response.data);
          showSuccessMessage("Timetable updated successfully");
        } else {
          showErrorMessage("Failed to update timetable");
          setTimetable(timetable);
          reset({
            courseId: selectedCourseId,
            semester: selectedSemester,
          });
        }
      } catch (error) {
        console.error("Error updating timetable:", error);
        showErrorMessage("Failed to update timetable");
      } finally {
        setSpinnerOpen(false);
      }
    } else {
      // Create new timetable
      setSpinnerOpen(true);
      try {
        const response: AppResponse<any> = await CourseService.createTimetable(
          formattedSchedule
        );
        if (response.success) {
          setTimetable(response.data);
          populateForm(response.data);
          showSuccessMessage("Timetable created successfully");
        } else {
          showErrorMessage("Failed to create timetable");
          setTimetable(null);
          reset({
            courseId: selectedCourseId,
            semester: selectedSemester,
          });
        }
      } catch (error) {
        console.error("Error creating timetable:", error);
        showErrorMessage("Failed to create timetable");
      } finally {
        setSpinnerOpen(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-col flex-grow">
    {/* <TitleBar /> */}
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-md rounded p-4"
    >
      <div className="mb-4">
        <label className="block text-gray-700">Course:</label>
        <select {...register("courseId")} className="w-full border p-2">
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <div className="mb-4">
          <label className="block text-gray-700">Semester:</label>
          <select {...register("semester")} className="w-full border p-2">
            <option value="">Select Semester</option>
            {courses
              .find((course) => course._id === selectedCourseId)
              ?.semesters.map((sem) => (
                <option key={sem.semesterNumber} value={sem.semesterNumber}>
                  {sem.semesterNumber}
                </option>
              ))}
          </select>
        </div>
      )}

      <table className="border-collapse w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 px-10">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="border border-gray-300 p-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((timeSlot, timeIndex) => (
            <tr key={timeSlot}>
              <td className="border border-gray-300 p-2 text-center">
                {timeSlot}
              </td>

              {DAYS.map((day) => (
                <td key={day} className="border border-gray-300 p-2">
                  <select
                    className="w-full border p-1 mb-1"
                    {...register(`${timeIndex}-${day}-module`)}
                    onChange={(e) => {
                      handleModuleChange(timeIndex, day, e.target.value);
                    }}
                    disabled={userType !== AdminType.ACADEMIC}
                  >
                    <option value="">Module</option>
                    {modules.map((module) => (
                      <option key={module._id} value={module._id}>
                        {module.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="w-full border p-1 mb-1"
                    {...register(`${timeIndex}-${day}-location`)}
                    disabled={userType !== AdminType.ACADEMIC}
                  >
                    <option value="">Resource</option>
                    {resources.map((resource) => (
                      <option key={resource._id} value={resource._id}>
                        {resource.building} {resource.floor} {resource.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="w-full border p-1 mb-1"
                    {...register(`${timeIndex}-${day}-lecturer`)}
                    disabled={userType !== AdminType.ACADEMIC}
                  >
                    <option value="">Lecturer</option>
                    {filteredLecturers[`${timeIndex}-${day}`]?.map((lecturer) => (
                      <option key={lecturer._id} value={lecturer._id}>
                        {lecturer.name}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {userType === AdminType.ACADEMIC && (
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          {timetable ? "Update Timetable" : "Create Timetable"}
        </button>
      )}
    </form>
  </div>
  );
};

export default TimeTable;