// components/PasswordInput.tsx
import { ComponentProps, forwardRef, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Input } from "./input";


type PasswordInputProps = ComponentProps<typeof Input>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? LuEyeOff : LuEye;

    return (
      <Input
        autoComplete="current-password"
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        rightIcon={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="flex items-center justify-center rounded p-0.5 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
          >
            <Icon size={16} aria-hidden />
          </button>
        }
      />
    );
  }
);