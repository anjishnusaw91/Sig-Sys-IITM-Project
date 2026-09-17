function StatBadge({ label, value }) {
    return (
        <div className="stat-badge">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

export default StatBadge;