import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/objects/user.object";
import { axiosInstance } from "@/util/request.util";
import { AlertCircleIcon, EditIcon, MailIcon, SaveIcon, ThumbsUpIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/app.context";

type UserEditSelfAttribute = {
  user: User;
  refresh: () => void;
};
export default function EditUserSelf({ user, refresh }: UserEditSelfAttribute) {
  const [open, setOpen] = useState(false);
  const { refreshData } = useContext(AppContext);
  const [form, setform] = useState({
    name: user.name,
    email: user.email,
    username: user.username,
  });
  const [errorUsername, setErrorUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  useEffect(() => {
    setform({
      name: user.name,
      email: user.email,
      username: user.username,
    });
  }, [user]);
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await axiosInstance
        .patch(ENDPOINT.SELF_EDIT, form)
        .then(() => {
          toaster.toast({
            title: "Berhasil",
            description: (
              <div className="flex gap-4">
                <ThumbsUpIcon /> Berhasi edit profil
              </div>
            ),
          });
          refreshData()
          setOpen(false);
          refresh();
        })
        .catch((err: any) => {
          if (err.code === 400) {
            toaster.toast({
              title: "Error",
              description: err.response.data.message[0],
              variant: "destructive",
            });
          } else {
            toaster.toast({
              title: "Error",
              description: err.response.data.message,
              variant: "destructive",
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [form]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setform((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <EditIcon className="w-4 h-4 text-primary" />
          Edit Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EditIcon className="w-5 h-5 text-primary" />
            Edit Profil User
          </DialogTitle>
          <DialogDescription>
            Ubah data profil Anda di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-1">
            <Label htmlFor="name" className="font-medium flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              Nama
            </Label>
            <Input
              id="name"
              type="text"
              disabled={loading}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="font-medium flex items-center gap-2">
              <MailIcon className="w-4 h-4 text-muted-foreground" />
              E-mail
            </Label>
            <Input
              id="email"
              disabled={loading}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Alamat email"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username" className="font-medium flex items-center gap-2">
              <UserCircleIcon className="w-4 h-4 text-muted-foreground" />
              Username
            </Label>
            <Input
              id="username"
              disabled={loading}
              name="username"
              value={form.username}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9]*$/.test(value)) {
                  setform((prev) => ({
                    ...prev,
                    username: value,
                  }));
                  setErrorUsername("");
                } else {
                  setErrorUsername("Username hanya boleh huruf dan angka");
                }
              }}
              placeholder="Username"
              autoComplete="off"
            />
            {errorUsername !== "" && (
              <div className="text-destructive text-xs mt-1 flex items-center gap-1">
                <AlertCircleIcon className="w-4 h-4" />
                {errorUsername}
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || errorUsername !== ""}
            className="w-full flex items-center gap-2"
          >
            <SaveIcon className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
