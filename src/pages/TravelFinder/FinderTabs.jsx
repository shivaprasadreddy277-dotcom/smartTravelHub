function FinderTabs({ activeTab, onChangeTab }) {
  return (
    <div className="finder-tabs">
      <button
        type="button"
        className={`finder-tab ${activeTab === 'style' ? 'active' : ''}`}
        onClick={() => onChangeTab('style')}
      >
        Travel Style Finder
      </button>
      <button
        type="button"
        className={`finder-tab ${activeTab === 'weekend' ? 'active' : ''}`}
        onClick={() => onChangeTab('weekend')}
      >
        Weekend Escape Finder
      </button>
    </div>
  )
}

export default FinderTabs
