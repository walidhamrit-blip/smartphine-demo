import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-wide flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl sm:text-6xl">This page slipped through the cracks.</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        The page you were looking for has moved or never existed. Our showroom in Tripoli is still very much open.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/shop" className="btn btn-outline">
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
