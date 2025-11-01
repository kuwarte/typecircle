import Link from "next/link";

export default function Test() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center md:px-40 px-4 ">
      <h1
        className="text-center md:text-left text-[5rem] md:text-[8rem] font-extrabold text-shadow-lg"
        style={{ color: "var(--typecircle-green)" }}
      >
        No Content
      </h1>

      <p className="text-center md:text-left text-sm md:text-xl text-muted-foreground">
        Go back to{" "}
        <Link
          href="/"
          className="hover:underline font-semibold"
          style={{ color: "var(--typecircle-green)" }}
        >
          home
        </Link>{" "}
        or{" "}
        <Link
          href="/rooms"
          className="hover:underline font-semibold"
          style={{ color: "var(--typecircle-green)" }}
        >
          connect
        </Link>{" "}
        with people.
      </p>
    </div>
  );
}
