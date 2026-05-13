// Server component — static background blur orbs
export default function BlurOrbs({ count = 2 }: { count?: 2 | 4 }) {
  return (
    <>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      {count >= 4 && (
        <>
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </>
      )}
    </>
  );
}
