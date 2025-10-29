import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FilterIcon, LoaderCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import { Student } from "@/objects/student.object";
import ENDPOINT from "@/config/url";
import { ViolationType } from "@/objects/violation-type.object";

type ViolationFilterParameter = {
  setStudentId: Dispatch<SetStateAction<number | null>>;
  setViolationTypeId: Dispatch<SetStateAction<number | null>>;
};
export default function ViolationFilterComponent({
  setStudentId,
  setViolationTypeId,
}: ViolationFilterParameter) {
  const [open, setOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [violationTypeSearch, setViolationTypeSearch] = useState("");
  const [openStudent, setOpenStudent] = useState(false);
  const [openViolationType, setOpenViolationType] = useState(false);
  const [studentValue, setStudentValue] = useState<Student>({
    id: 0,
    name: "",
  });
  const [violationTypeValue, setViolationTypeValue] = useState<ViolationType>({
    id: 0,
    name: "",
    point: 0,
  });
  const {
    data: studentData,
    loading: studentLoading,
  } = useInfiniteScroll<Student, HTMLDivElement>({
    filter: { search: studentSearch },
    take: 50,
    url: ENDPOINT.MASTER_STUDENT_SEARCH,
  });
  const {
    data: violationTypeData,
    loading: violationTypeLoading,
  } = useInfiniteScroll<ViolationType, HTMLDivElement>({
    filter: { search: violationTypeSearch },
    take: 50,
    url: ENDPOINT.MASTER_VIOLATION_TYPE,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Filter <FilterIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Filter Pencarian</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4">
              <Label>Cari Siswa</Label>
              <Popover open={openStudent} onOpenChange={setOpenStudent}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-[400px]"
                  >
                    {studentValue.id !== 0
                      ? studentData.find(
                          (student) => student.id === studentValue.id
                        )?.name
                      : "Pilih Siswa"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command
                  filter={() => 1} 
                  >
                    <CommandInput
                      placeholder="Cari Siswa"
                      className="h-9"
                      onValueChange={(e) => setStudentSearch(e)}
                    />
                    <CommandList>
                      <CommandEmpty>Siswa tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {studentData.map((student) => {
                          return(
                          <CommandItem
                            key={student.id}
                            value={String(student.id)}
                            onSelect={(currentValue) => {
                              const selectedStudent = studentData.find(
                                (st) => Number(currentValue) === st.id
                              );
                              setStudentValue(
                                currentValue === String(studentValue.id) ||
                                  !selectedStudent
                                  ? { id: 0, name: "" }
                                  : selectedStudent
                              );
                              if (currentValue === String(studentValue.id)) {
                                setStudentId(null);
                              } else {
                                setStudentId(selectedStudent?.id || null);
                              }
                              setOpenStudent(false);
                            }}
                          >
                            {student.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                studentValue.id === student.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        )})}
                        {studentLoading && (
                          <CommandItem>
                            <LoaderCircleIcon />
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Label>Cari Tipe Pelanggaran</Label>
              <Popover
                open={openViolationType}
                onOpenChange={setOpenViolationType}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-[400px]"
                  >
                    {violationTypeValue.id !== 0
                      ? violationTypeData.find(
                          (violationType) =>
                            violationType.id === violationTypeValue.id
                        )?.name
                      : "Pilih Jenis Pelanggaran"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Cari Jenis Pelanggaran"
                      className="h-9"
                      onValueChange={(e) => setViolationTypeSearch(e)}
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {violationTypeData.map((violationType) => (
                          <CommandItem
                            key={violationType.id}
                            value={String(violationType.id)}
                            onSelect={(currentValue) => {
                              const selectedViolationType =
                                violationTypeData.find(
                                  (st) => Number(currentValue) === st.id
                                );
                              setViolationTypeValue(
                                currentValue ===
                                  String(violationTypeValue.id) ||
                                  !selectedViolationType
                                  ? { id: 0, name: "", point: 0 }
                                  : selectedViolationType
                              );
                              if (currentValue === String(violationTypeValue.id)) {
                                setViolationTypeId(null);
                              } else {
                                setViolationTypeId(selectedViolationType?.id || null);
                              }
                              setOpenViolationType(false);
                            }}
                          >
                            {violationType.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                violationTypeValue.id === violationType.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                        {violationTypeLoading && (
                          <CommandItem>
                            <LoaderCircleIcon />
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
