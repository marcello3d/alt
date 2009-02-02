package cello.alt.db;

import java.io.IOException;
import java.util.Comparator;

import jdbm.RecordManager;
import jdbm.RecordManagerFactory;
import jdbm.btree.BTree;
import jdbm.htree.HTree;

public class PersistentStore {

    private RecordManager recman;
	
	public PersistentStore(String id) throws IOException {
		recman = RecordManagerFactory.createRecordManager(id);
	}

	public BTree newArray(Comparator c) throws IOException {
		return BTree.createInstance(recman, c);
	}
	public HTree newHash() throws IOException {
		return HTree.createInstance(recman);
	}
}
