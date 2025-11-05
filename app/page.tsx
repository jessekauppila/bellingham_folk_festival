'use client';

import { useCallback, useState } from 'react';
import debug from '../lib/debug';
import EventsFetcher, {
  type EventData,
} from '../components/EventsFetcher';

const log = debug('app:home');

interface ExpansionBlockProps {
  level: 1 | 2 | 3;
  title: string;
  children: React.ReactNode;
  id: string;
  expandedPaths: Set<string>;
  onToggle: (id: string) => void;
  inset?: boolean;
}

function ExpansionBlock({
  level,
  title,
  children,
  id,
  expandedPaths,
  onToggle,
  inset = false,
}: ExpansionBlockProps) {
  const isExpanded = expandedPaths.has(id);

  const handleClick = () => {
    onToggle(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div className={`expansion-block level-${level}`}>
      <div
        className="opener-button"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
      >
        {level === 3 ? (
          <h3 className={`expander-link level-${level}`}>{title}</h3>
        ) : (
          <h2 className={`expander-link level-${level}`}>{title}</h2>
        )}
      </div>
      <div
        className={`content-wrap ${inset ? 'inset' : ''}`}
        hidden={!isExpanded}
        aria-hidden={!isExpanded}
      >
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const REAL_SHEET_ID =
    '1ELrjMXnCNGgzCFMhRU6IeGp6hkaua_WECATAvRdBubM';
  const REAL_GID = '0';

  const [events, setEvents] = useState<EventData[] | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set()
  );

  const handleDataFetched = useCallback((data: EventData[]) => {
    setEvents(data);
    log('Events data received:', data);
  }, []);

  // Get all ancestor IDs for a given block ID
  const getAncestorIds = (id: string): string[] => {
    const parts = id.split('-');
    const ancestors: string[] = [];
    for (let i = 1; i < parts.length; i++) {
      ancestors.push(parts.slice(0, i).join('-'));
    }
    return ancestors;
  };

  const handleToggle = (id: string) => {
    setExpandedPaths((prev) => {
      const ancestors = getAncestorIds(id);
      const isCurrentlyExpanded = prev.has(id);

      // Build the set of paths to keep open (ancestors, and if opening, also include self)
      const pathsToKeep = new Set(ancestors);
      if (!isCurrentlyExpanded) {
        pathsToKeep.add(id);
      }

      // Start with paths to keep from previous state
      const updated = new Set<string>();
      prev.forEach((pathId) => {
        if (pathsToKeep.has(pathId)) {
          updated.add(pathId);
        }
      });

      // Add new paths if opening (ensures ancestors and self are included)
      if (!isCurrentlyExpanded) {
        ancestors.forEach((ancestorId) => updated.add(ancestorId));
        updated.add(id);
      }

      return updated;
    });
  };

  log('Current events state:', events);

  return (
    <>
      <EventsFetcher
        sheetId={REAL_SHEET_ID}
        gid={REAL_GID}
        headerRow={10}
        onDataFetched={handleDataFetched}
      />
      <div className="page">
        <div className="hero-wrap">
          <div className="page-super-title">Welcome to the</div>
          <h1 className="page-title">Bellingham Folk Festival</h1>
          <p className="big-date">January 22nd-25th, 2026</p>
          <p>
            The Bellingham Folk Festival is a homemade weekend of
            music and people that takes place in the heart of
            beautiful Bellingham, WA
          </p>
        </div>
        <div className="list-level-1">
          <div className="list-level-2">
            <ExpansionBlock
              level={1}
              title="Learn"
              id="learn"
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
            >
              <ExpansionBlock
                level={2}
                title="What it is"
                id="learn-what"
                expandedPaths={expandedPaths}
                onToggle={handleToggle}
                inset={true}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros
                  dolor interdum nulla, ut commodo diam libero vitae
                  erat. Aenean faucibus nibh et justo cursus id rutrum
                  lorem imperdiet. Nunc ut sem vitae risus tristique
                  posuere.
                </p>
              </ExpansionBlock>
              <ExpansionBlock
                level={2}
                title="When it is"
                id="learn-when"
                expandedPaths={expandedPaths}
                onToggle={handleToggle}
                inset={true}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros
                  dolor interdum nulla, ut commodo diam libero vitae
                  erat. Aenean faucibus nibh et justo cursus id rutrum
                  lorem imperdiet. Nunc ut sem vitae risus tristique
                  posuere.
                </p>
              </ExpansionBlock>
              <ExpansionBlock
                level={2}
                title="Where it is"
                id="learn-where"
                expandedPaths={expandedPaths}
                onToggle={handleToggle}
                inset={true}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros
                  dolor interdum nulla, ut commodo diam libero vitae
                  erat. Aenean faucibus nibh et justo cursus id rutrum
                  lorem imperdiet. Nunc ut sem vitae risus tristique
                  posuere.
                </p>
              </ExpansionBlock>
            </ExpansionBlock>
          </div>
          <div className="list-level-2">
            <ExpansionBlock
              level={1}
              title="Organize"
              id="organize"
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
              inset={true}
            >
              <h3>
                Bellingham Folk Festival is a community-built
                celebration.
              </h3>
              <p>
                Every concert, workshop, session, or gathering is
                created and hosted by people who want to share what
                they love — musicians, teachers, neighbors, and local
                businesses working together to make the festival come
                alive.
              </p>
              <p>
                If you&apos;d like to be part of it, we&apos;d love to
                hear from you.
              </p>
              <h4>Venues &amp; Hosts</h4>
              <p>
                Have a space that would be a great setting for music,
                workshops, or community events? Local businesses,
                cafés, and gathering spots help anchor the festival
                throughout the city.
              </p>
              <h4>Performers &amp; Presenters</h4>
              <p>
                Artists, bands, workshop leaders, session hosts,
                storytellers — if you want to share your craft with
                the festival community, let us know a little about
                what you do.
              </p>
              <h4>Volunteers</h4>
              <p>
                From hanging posters to setting up spaces and helping
                festival-goers find their way, volunteers keep
                everything running smoothly. Light work, big impact,
                lots of fun.
              </p>
            </ExpansionBlock>
          </div>
          <div className="list-level-2">
            <ExpansionBlock
              level={1}
              title="Attend"
              id="attend"
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
            >
              <ExpansionBlock
                level={2}
                title="Thursday"
                id="attend-thursday"
                expandedPaths={expandedPaths}
                onToggle={handleToggle}
              >
                <ExpansionBlock
                  level={3}
                  title="Event Name"
                  id="attend-thursday-event1"
                  expandedPaths={expandedPaths}
                  onToggle={handleToggle}
                >
                  <div className="event-detail-wrap">
                    <div>Organizer</div>
                    <div>Date &amp; Time</div>
                    <div>Location</div>
                    <div>Price</div>
                  </div>
                </ExpansionBlock>
                <ExpansionBlock
                  level={3}
                  title="Event Name"
                  id="attend-thursday-event2"
                  expandedPaths={expandedPaths}
                  onToggle={handleToggle}
                >
                  <div className="event-detail-wrap">
                    <div>Organizer</div>
                    <div>Date &amp; Time</div>
                    <div>Location</div>
                    <div>Price</div>
                  </div>
                </ExpansionBlock>
              </ExpansionBlock>
              <ExpansionBlock
                level={2}
                title="Friday"
                id="attend-friday"
                expandedPaths={expandedPaths}
                onToggle={handleToggle}
              >
                <ExpansionBlock
                  level={3}
                  title="Event Name"
                  id="attend-friday-event1"
                  expandedPaths={expandedPaths}
                  onToggle={handleToggle}
                >
                  <div className="event-detail-wrap">
                    <div>Organizer</div>
                    <div>Date &amp; Time</div>
                    <div>Location</div>
                    <div>Price</div>
                  </div>
                </ExpansionBlock>
                <ExpansionBlock
                  level={3}
                  title="Event Name"
                  id="attend-friday-event2"
                  expandedPaths={expandedPaths}
                  onToggle={handleToggle}
                >
                  <div className="event-detail-wrap">
                    <div>Organizer</div>
                    <div>Date &amp; Time</div>
                    <div>Location</div>
                    <div>Price</div>
                  </div>
                </ExpansionBlock>
              </ExpansionBlock>
            </ExpansionBlock>
          </div>
        </div>
      </div>
    </>
  );
}
