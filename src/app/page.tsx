import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FaComments, FaRegCircle, FaUser, FaUsers } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center md:px-40">
        <h1
          className="flex items-center justify-center md:justify-start text-[5rem] md:text-[8rem] font-extrabold mb-4 gap-2 text-shadow-lg"
          style={{ color: "var(--typecircle-green)" }}
        >
          <FaRegCircle
            className="text-card-foreground hidden md:block"
            style={{ color: "var(--typecircle-green)" }}
          />
          <span className="underline decoration-wavy md:decoration-12 decoration-8 md:underline-offset-36 underline-offset-28 mb-3 md:mb-6">
            typecircle
          </span>
        </h1>
        <p className="flex items-center justify-center md:justify-start text-sm md:text-xl text-muted-foreground gap-1">
          Discover your{" "}
          <Link
            href="/enneagram/test"
            className="hover:underline"
            style={{ color: "var(--typecircle-green)" }}
          >
            personality type
          </Link>{" "}
          and{" "}
          <Link
            href="/rooms"
            className="hover:underline"
            style={{ color: "var(--typecircle-green)" }}
          >
            connect
          </Link>{" "}
          with people.
        </p>
      </div>
      <div className="min-h-100 bg-card/50 backdrop-blur-md outline outline-card-border p-12 flex flex-col md:flex-row justify-center md:space-x-8 space-y-8 md:space-y-0 md:px-40">
        <div className="p-2 bg-card/90">
          <Card className="hover:bg-[var(--typecircle-green)]/5 transition-bg min-h-full">
            <div className="flex-1 p-6 text-center overflow-hidden  pt-12 hover:scale-[1.05] transition-transform">
              <FaUser className="mx-auto mb-4 text-4xl text-primary" />
              <h2 className="text-xl font-semibold mb-2">Discover Yourself</h2>
              <p className="text-muted-foreground">
                Take our Enneagram personality test to understand your type and
                traits.
              </p>
            </div>
          </Card>
        </div>
        <div className="p-2 bg-card/90">
          <Card className="hover:bg-[var(--typecircle-green)]/5 transition-bg min-h-full">
            <div className="flex-1 p-6 text-center overflow-hidden  pt-12 hover:scale-[1.05] transition-transform">
              <FaUsers className="mx-auto mb-4 text-4xl text-primary" />
              <h2 className="text-xl font-semibold mb-2">
                Connect with Others
              </h2>
              <p className="text-muted-foreground">
                Meet people with similar personalities and join rooms that match
                your type.
              </p>
            </div>
          </Card>
        </div>
        <div className="flex flex-col p-2 bg-card/90">
          <Card className="hover:bg-[var(--typecircle-green)]/5 transition-bg min-h-full">
            <div className="flex-1 p-6 text-center overflow-hidden  pt-12 hover:scale-[1.05] transition-transform">
              <FaComments className="mx-auto mb-4 text-4xl text-primary" />
              <h2 className="text-xl font-semibold mb-2">Chat & Share</h2>
              <p className="text-muted-foreground">
                Engage in conversations, share insights, and grow with the
                community.
              </p>
            </div>
          </Card>
          <div className="outline"></div>
        </div>
      </div>
    </>
  );
}
